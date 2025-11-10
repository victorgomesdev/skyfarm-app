export type CreateAreaRequest = {
    name: string,
    coords: string,
    datefrom: string,
    dateto: string,
    project_id: string,
    metrics: string[],
    aggregation: number,
    size: number,
    saved: boolean,
    savedName: string
}