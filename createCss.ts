import { IStickerOutPut } from './interfaces/json5.ts'
const decoder = new TextDecoder('utf-8')
const mastodon = decoder.decode(await Deno.readFile(`./template/mastodon.sticker`))
const append = {
    mastodon: mastodon
}
const sticker = decoder.decode(await Deno.readFile(`./template/sticker.sticker`))
const twoLetters = {
	mastodon: 'md',
	pleroma: 'pl',
	misskey: 'mi',
	misskeylegacy: 'ml',
	pixelfed: 'pf',
}

export default function (raw: {updated: string, data: IStickerOutPut[]}, type: 'mastodon') {
    const obj = raw.data
	let output = ''
	for (let i = 0; i < obj.length; i++) {
		const target = obj[i]
		let { domain, name, bgColor, fontColor, favicon } = target
		const type = target.type as 'mastodon' | 'pleroma' | 'misskey' | 'misskeylegacy' | 'pixelfed'
		if (!name) name = domain
		const tl = twoLetters[type]
		let bgColorCSS = `var(--${tl})`
		let bgColorTCSS = `var(--${tl}t)`
		if (bgColor) {
			bgColorCSS = ''
			bgColorTCSS = ''
			for (let j = 0; j < bgColor.length; j++) {
				const bg = bgColor[j]
				bgColorCSS = bgColorCSS + bg + ','
				bgColorTCSS = bgColorTCSS + bg + ' 84%,'
			}
			bgColorCSS = `linear-gradient(90deg, ${bgColorCSS} transparent)`
			bgColorTCSS = `linear-gradient(90deg, ${bgColorTCSS} transparent)`
		}
		let isDefault = false
		if (favicon == `https://s.0px.io/a/${tl}`) isDefault = true
		if(!isDefault && favicon) favicon = `https://f.0px.io/c/${btoa(favicon.replace('https://', ''))}`
		let faviconCSS = `no-repeat url('${favicon}')`
		if (isDefault) faviconCSS = `var(--${tl}f)`
		if (!fontColor) fontColor = `var(--${tl}c)`
		const str = sticker
			.replace(/{{domain}}/g, domain)
			.replace(/{{name}}/g, name)
			.replace(/{{bg}}/g, bgColorCSS)
			.replace(/{{bgt}}/g, bgColorTCSS)
			.replace(/{{favicon}}/g, faviconCSS)
			.replace(/{{color}}/g, fontColor)
		output = output + str
	}
	return append[type].replace(/{{updated}}/g, raw.updated) + output
}
