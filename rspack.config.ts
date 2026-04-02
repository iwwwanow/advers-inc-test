import { defineConfig } from "@meteorjs/rspack";
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";

export default defineConfig((/* Meteor */) => {
  return {
    plugins: [new TsCheckerRspackPlugin()],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                decorators: true,
                tsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                },
                decoratorMetadata: true,
                legacyDecorator: true,
              },
            },
          },
        },
      ],
    },
  };
});
