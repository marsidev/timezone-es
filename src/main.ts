import './style.css'
import 'toastify-js/src/toastify.css'
import { $, copyResult, fillTextarea, setCurrentDate } from './utils'

const $form = $('form') as HTMLFormElement
const $copyButton = $('#copy-btn') as HTMLFormElement

setCurrentDate()
fillTextarea()

$form.addEventListener('change', async event => {
	event.preventDefault()
	fillTextarea()
	await copyResult()
})

$copyButton.onclick = copyResult
