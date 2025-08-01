import {internalMutation, mutation, query, QueryCtx} from './_generated/server'
import {UserJSON} from '@clerk/backend'
import {v, Validator} from 'convex/values'

async function userByExternalId(ctx: QueryCtx, externalId: string) {
    return await ctx.db.query('users').withIndex('by_externalId', (q) => q.eq('externalId', externalId)).unique()
}


export async function getCurrentUser(ctx: QueryCtx) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
        return null
    }

    return await userByExternalId(ctx, identity.subject)
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
    const userRecord = await getCurrentUser(ctx);
    if (!userRecord) throw new Error("Can't get current user");
    return userRecord;
  }

  export const current = query({
    args: {},
    handler: async (ctx) => {
      return await getCurrentUser(ctx);
    },
  });
  
  export const upsertFromClerk = internalMutation({
    args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
    async handler(ctx, { data }) {
      // Extract data from publicMetadata if available
      const publicMetadata = data.public_metadata as any || {};
      const isOnboardingComplete = publicMetadata.onboardingComplete === true;
      
      // Safely extract name, phone, and cpf with proper type checking
      const metadataName = typeof publicMetadata.name === 'string' ? publicMetadata.name : null;
      const metadataPhone = typeof publicMetadata.phone === 'string' ? publicMetadata.phone : null;
      const metadataCpf = typeof publicMetadata.cpf === 'string' ? publicMetadata.cpf : null;
      
      const userAttributes = {
        name: metadataName || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        phone: metadataPhone,
        cpf: metadataCpf,
        externalId: data.id,
        onboardingCompleted: isOnboardingComplete,
        role: 'user' as const,
      };
  
      const user = await userByExternalId(ctx, data.id);
      if (user === null) {
        await ctx.db.insert("users", userAttributes);
      } else {
        // Update user with data from Clerk, including publicMetadata
        const updateData: any = {
          name: userAttributes.name,
          onboardingCompleted: userAttributes.onboardingCompleted,
          role: userAttributes.role,
        };
        
        // Only include phone if it exists
        if (userAttributes.phone) {
          updateData.phone = userAttributes.phone;
        }
        
        // Only include cpf if it exists
        if (userAttributes.cpf) {
          updateData.cpf = userAttributes.cpf;
        }
        
        await ctx.db.patch(user._id, updateData);
      }
    },
  });
  
  export const deleteFromClerk = internalMutation({
    args: { clerkUserId: v.string() },
    async handler(ctx, { clerkUserId }) {
      const user = await userByExternalId(ctx, clerkUserId);
  
      if (user !== null) {
        await ctx.db.delete(user._id);
      } else {
        console.warn(
          `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
        );
      }
    },
  });

  // Complete user onboarding with additional information
  export const completeOnboarding = mutation({
    args: { 
      name: v.string(),
      phone: v.string(),
      cpf: v.string()
    },
    async handler(ctx, { name, phone, cpf }) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      const user = await userByExternalId(ctx, identity.subject);
      if (!user) {
        throw new Error("User not found");
      }

      // Update user with onboarding data
      await ctx.db.patch(user._id, {
        name,
        phone,
        cpf,
        onboardingCompleted: true,
        role: 'user',
      });

      return user._id;
    },
  });

  // Check if user needs onboarding
  export const needsOnboarding = query({
    args: {},
    async handler(ctx) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return null;
      }

      const user = await userByExternalId(ctx, identity.subject);
      if (!user) {
        return null;
      }

      return !user.onboardingCompleted;
    },
  });