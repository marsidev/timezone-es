import type { DatesByGMT } from './types'
import Toastify from 'toastify-js'
import { countries } from './countries'

export const $ = (selector: string): Element | null => document.querySelector(selector)

const $input = $('#date-input') as HTMLInputElement
const $result = $('#result') as HTMLTextAreaElement

export const setCurrentDate = () => {
	const dt = new Date()
	const tzOffset = dt.getTimezoneOffset() * 60 * 1000
	const dtLocal = dt.getTime() - tzOffset
	const dtLocalDate = new Date(dtLocal)
	const iso = dtLocalDate.toISOString().slice(0, 16) // keep the first 16 chars (YYYY-MM-DDTHH:mm)
	$input.value = iso
}

export const fillTextarea = () => {
	const date = new Date($input.value)

	const { locale } = Intl.DateTimeFormat().resolvedOptions()
	const datesByGMT: DatesByGMT = {}

	countries.forEach(country => {
		const formatter = new Intl.DateTimeFormat(locale, {
			hour: 'numeric',
			minute: 'numeric',
			// second: 'numeric',
			// dayPeriod: 'short',
			hour12: false,
			// weekday: 'long',
			timeZone: country.timeZone,
			timeZoneName: 'longOffset'
		})

		const fullDate = formatter.format(date)
		const gmt = fullDate.slice(-9)

		if (!datesByGMT[gmt]) {
			datesByGMT[gmt] = {
				fullDate,
				countries: [],
				countriesCount: 0
			}
		}

		datesByGMT[gmt].countries.push({
			name: country.name,
			id: country.id,
			timeZone: country.timeZone,
			emoji: country.emoji
		})

		datesByGMT[gmt].countriesCount++
	})

	console.log(datesByGMT)

	const datesByGMTSorted: DatesByGMT = Object.entries(datesByGMT)
		.sort(([, a], [, b]) => b.countriesCount - a.countriesCount)
		.reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

	const timesFormatted = formatResult(datesByGMTSorted)
	$result.value = timesFormatted
	$result.rows = Object.keys(datesByGMTSorted).length + 1
}

export const formatResult = (dates: DatesByGMT) => {
	let result = ''

	for (const gmt of Object.keys(dates)) {
		const { countries } = dates[gmt]
		const emojis = countries.map(country => country.emoji).join(' ')

		let cleanDate = dates[gmt].fullDate
			.replace(gmt, '')
			.replace(':00', '')
			.trim()
		if (cleanDate === '24') cleanDate = '00'

		result += `${emojis} ${cleanDate}H\n`
	}

	console.log(result)
	return result
}

export const copyTextToClipboard = async (text: string) => {
	if ('clipboard' in navigator) {
		return await navigator.clipboard.writeText(text)
	} else {
		return document.execCommand('copy', true, text)
	}
}

export const copyResult = async () => {
	await copyTextToClipboard($result.value)

	Toastify({
		text: '¡Copiado al portapapeles!',
		duration: 3000,
		newWindow: true,
		close: true,
		gravity: 'top',
		position: 'center',
		stopOnFocus: false,
		style: {
			display: 'flex'
		}
	}).showToast()
}
