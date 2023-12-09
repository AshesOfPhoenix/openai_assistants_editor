import { LightningBoltIcon } from '@radix-ui/react-icons';
import React from 'react';

const Header = () => {
    return (
        <header className="absolute top-0 left-0 right-0 bg-base-200 border-t border-base-content/10">
            <p className="fixed left-0 top-0 flex w-full justify-center lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200 hover:shadow-md items-center border-b border-gray-300 bg-gradient-to-b from-zinc-100/50 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:border lg:bg-gray-200/5 py-4 lg:px-4 lg:py-2 lg:dark:bg-zinc-800/30">
                Assistants <LightningBoltIcon className="ml-2 text-yellow-500" width={20} height={20} />
            </p>
        </header>
    );
};

export default Header;
