export interface commandProperties {
    name: string,
    description: string,
    category: string,
    linked_service: string,
    aliases: string[],
    available: boolean,
    premium: boolean,
    development: boolean,
    usage: {
        parameters: string[]
    },
    permissions: string[],
    userPermissions: string[],
    cooldown: {
        default: number,
        premium: number,
        development: number
    },
    helper: object[]
};

export interface serviceProperties {
    name: string,
    available: boolean,
    on_development: boolean,
    premium: boolean,
    commands: any[],
    events: any[]
};

export interface moduleProperties {
    name: string,
    premium: boolean,
    categories: any[]
};

export interface eventProperties {
    name: string,
    listener: string,
    linked_service: string
};

export interface routeProperties {
    name: string,
    routes: string[]
};

export interface cacheOptions {
    interval: number,
    except: any[]
};

export interface disabledCommand {
    name: string,
    disabled_by: string,
    disabled_timestamp: number
};

export interface ticketStructure {
    id: string,
    channel_id: string,
    parent_id: string,
    name: string,
    created_by: string,
    creation_timestamp: number,
    open: boolean,
    closed: boolean,
    paused: boolean
};

export const support_invite_url: string = "https://discord.gg/ptJXWU7";