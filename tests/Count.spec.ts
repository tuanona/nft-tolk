import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Count } from '../wrappers/Count';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Count Yeah', () => { let code: Cell; })

describe('Count', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Count');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Count>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counter = blockchain.openContract(
            Count.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });

    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await counter.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('incrasing by', increaseBy);

            const increaseResult = await counter.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: counter.address,
                success: true
            });

            const counterAfter = await counter.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });

    it('should reset counter', async () => {
        const increaser = await blockchain.treasury('increaser');

        expect(await counter.getCounter()).toBe(0);

        const increaseBy = 5;
        await counter.sendIncrease(increaser.getSender(), {
            increaseBy,
            value: toNano('0.05')
        });

        expect(await counter.getCounter()).toBe(increaseBy);

        await counter.sendReset(increaser.getSender(), {
            value: toNano('0.05')
        });

        expect(await counter.getCounter()).toBe(0);

    });
});
