export interface Country {
	name: string
	id: string
	timeZone: string
	emoji?: string
}

export interface GMTList {
	fullDate: string
	countries: Country[]
	countriesCount: number
}

export type DatesByGMT = Record<string, GMTList>
