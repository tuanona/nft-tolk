import { Address, toNano } from '@ton/core';
import { Count } from '../wrappers/Count';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Count address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Err: Contract at address ${address} is not deployed!`);
        return;
    }

    const counter = provider.open(Count.createFromAddress(address));

    const counterBefore = await counter.getCounter();

    await counter.sendIncrease(provider.sender(), {
        increaseBy: 1,
        value: toNano('0.05')
    });

    ui.write('Waiting for counter to increase...');

    let counterAfter = await counter.getCounter();
    let attempt = 1;
    while(counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await counter.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter incread successfully');
}