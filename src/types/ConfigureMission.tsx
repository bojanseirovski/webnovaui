export type ConfigureMission = {
    user: string;
    api_key: string;
    norad_id: number;
    instrument_id: number;
    lat:number;
    lon: number;
    start_date: string;
    mission_type: string;
    description: string;
    passes: Array<Array<string>>;
    net: string;
    nlt: string;
};