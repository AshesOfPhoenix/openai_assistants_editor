import React from 'react';
import { LightningBoltIcon } from '@radix-ui/react-icons';

export const GPT4 = () => {
    return (
        <div className="fixed left-0 top-0 flex h-9 py-4 lg:px-4 lg:py-2 w-full justify-center lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200 hover:shadow-md items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-lg lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30 cursor-pointer">
            <span>GPT-4 Inside</span>{' '}
            <LightningBoltIcon className="ml-2 text-yellow-500" width={20} height={20} />
        </div>
    );
};
