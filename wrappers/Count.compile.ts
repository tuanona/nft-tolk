import { CompilerConfig } from "@ton/blueprint";

export const compiler: CompilerConfig = {
    lang: 'tolk',
    entrypoint: 'contracts/count.tolk',
    experimentalOptions: '',
    withStackComments: true,
    withSrcLineComments: true,
};
    // You can add other properties from CompilerConfig here if needed.
    // For example:
    // sources: [],