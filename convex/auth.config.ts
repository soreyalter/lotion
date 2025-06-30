const authConfig = {
  providers: [
    {
      // clerk 的公开认证域名
      domain: "https://noble-marten-14.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
};

export default authConfig;