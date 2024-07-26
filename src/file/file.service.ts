import { BadRequestException, Injectable } from '@nestjs/common'
import { createWriteStream } from 'fs'
import { access, mkdir, unlink } from 'fs/promises'
import { FileUpload } from 'graphql-upload-ts'
import { dirname, extname, join } from 'path'
import { v4 } from 'uuid'

const ALLOWED_FILE_TYPES = {
	image: ['image/jpeg', 'image/png'],
	video: ['video/mp4']
}

@Injectable()
export class FileService {
	async saveFile(
		{ createReadStream, filename, mimetype }: FileUpload,
		folder: string,
		fileType: 'image' | 'video'
	): Promise<string> {
		if (!ALLOWED_FILE_TYPES[fileType].includes(mimetype)) {
			throw new BadRequestException(`Invalid format for ${fileType}`)
		}

		const date = new Date()
		const year = date.getFullYear().toString()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')

		const uuid = v4()

		const fileExtension = extname(filename)
		const filePath = join(folder, year, month, day, uuid + fileExtension)
		const outputPath = join('uploads', filePath)

		await mkdir(dirname(outputPath), { recursive: true })

		return new Promise((resolve, reject) => {
			const stream = createReadStream()
			const outStream = createWriteStream(outputPath)
			stream
				.pipe(outStream)
				.on('error', reject)
				.on('finish', () => resolve(filePath))
		})
	}

	async deleteFile(filePath: string) {
		const fullPath = join('uploads', filePath)

		try {
			await access(fullPath)
			await unlink(fullPath)
			return true
		} catch (err) {
			throw new BadRequestException(`Error deleting file: ${err.message}`)
		}
	}
}
