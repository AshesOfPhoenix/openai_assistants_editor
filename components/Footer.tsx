import React from 'react';

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-0 bg-base-200 border-t border-base-content/10">
            <div className="max-w-7xl mx-auto px-8 py-2">
                <div className="flex lg:items-center lg:justify-between md:flex-row md:flex-nowrap flex-wrap">
                    <div className="">
                        <p className="text-sm font-normal text-zinc-400">@ Gptnomics 2024</p>
                    </div>
                    <div>
                        <p className="text-sm font-normal text-zinc-500">Made by Kris 👽</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
