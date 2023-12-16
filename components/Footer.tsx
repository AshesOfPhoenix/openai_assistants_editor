import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-0 border-t bg-base-200 border-base-content/10">
            <div className="px-8 py-2 mx-auto max-w-7xl">
                <div className="flex flex-wrap lg:items-center lg:justify-between md:flex-row md:flex-nowrap">
                    <div className="">
                        <p className="text-sm font-normal text-zinc-400">@ Gptnomics 2024</p>
                    </div>
                    <div>
                        <Link
                            href={'https://twitter.com/ItsKrisKriz'}
                            target="_blank"
                            className="text-sm font-normal text-zinc-500"
                        >
                            Made by Kris 👽
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
