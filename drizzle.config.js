export default {
  dialect: "postgresql",
  schema: "./src/utils/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: "postgresql://simplify_owner:MELWl40yswPb@ep-broad-base-a17yyp8y-pooler.ap-southeast-1.aws.neon.tech/simplify?sslmode=require",
    connectionString:
      "postgresql://simplify_owner:MELWl40yswPb@ep-broad-base-a17yyp8y.ap-southeast-1.aws.neon.tech/simplify",
  },
};

//db string