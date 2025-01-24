import React from 'react';

export default function NavigationBar() {
    return (
        <div className={"h-[58px] w-full bg-White flex justify-center shadow-[0px_1px_7px_0px_#282F2D12]"}>
            <div className={'w-[1120px] flex flex-row items-center justify-between'}>
                <div className={"flex flex-row items-center gap-2"}>
                    <img src={"/icons/logo.svg"} alt={"logo"}/>
                    <Search/>
                </div>
                <div className={"flex flex-row h-full"}>
                    <Tabs/>
                    <img src={"/icons/user-avatar.svg"} alt={"user-avatar"} height={40} width={40}/>
                </div>
            </div>
        </div>)
}

function Tabs() {
    const tabs = [
        {icon: 'home.svg', title: 'Home'},
        {icon: 'message.svg', title: 'Messaging'},
        {icon: 'notification.svg', title: 'Notifications'}
    ]
    return (<div className={"flex flex-row"}>
        {tabs.map((tab, index) => {
             return <Tab icon={tab.icon} title={tab.title} key={index} active={isActive(tab.title)}/>
        })}
    </div>)

    function isActive(title: string) {
        //will be replaced with the actual active check
        return title === 'Home'
    }
}

function Tab(props: { icon: string, title: string, key?: number, active: boolean }) {
    //todo: check "after" so the underline will be rounded
    const activeClass = props.active ? 'text-GreenBlue text-bold border-b-2 border-GreenBlue ' : 'text-LightGray'
    return (<div className={` ${activeClass} h-full flex flex-row gap-1 items-center justify-center pl-1 pr-5`}>
        <div>
            <img src={`/icons/${props.icon}`} alt={props.title}/>
        </div>
        <div>{props.title}</div>
    </div>)
}

function Search() {
    return (<div className={'h-10 w-[216px] rounded-full bg-VeryLightGray flex flex-row items-center gap-1 text-LightGray pl-4'}>
        <img src={"/icons/search.svg"} alt={"search"} height={16} width={16}/>
        <div>
            search
        </div>
    </div>)
}
