export default {
    providers: [
      {
        domain: process.env.CLERK_JWT_ISSUER_DOMAIN, // ou coloque o Issuer URL diretamente
        applicationID: "convex",
      },
    ],
  };