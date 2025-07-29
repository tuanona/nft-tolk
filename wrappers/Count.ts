import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export type CounterConfig = {
    id: number;
    counter: number;
}

export function counterConfigToCell(conf: CounterConfig): Cell {
    let a = beginCell().storeUint(conf.id, 32).storeUint(conf.counter, 32).endCell();
    return a;
}

export const Opcode = {
    OP_ADD: 0x7e8764ef,
    OP_RESET: 0x3a752f06
}

export class Count implements Contract {
    constructor (readonly address: Address, readonly init?: {code: Cell; data: Cell}) {}

    static createFromAddress(address: Address) {
        return new Count(address);
    }

    static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
        const data =  counterConfigToCell(config);
        const init = { code, data};
        return new Count(contractAddress(workchain, init))
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(Opcode.OP_ADD, 32)
            .storeUint(opts.queryID ?? 0, 32)
            .storeUint(opts.increaseBy, 32)
            .endCell()
        });
    }

    async sendReset(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(Opcode.OP_RESET, 32)
            .storeUint(opts.queryID ?? 0, 32)
            .endCell()
        });
    }

    async getCounter (provider: ContractProvider) {
        const result = await provider.get('currentCounter', []);
        return result.stack.readNumber();
    }

    async getID (provider: ContractProvider) {
        const result = (await provider.get('initialId', [])).stack.readNumber();
        return result;
    }
}