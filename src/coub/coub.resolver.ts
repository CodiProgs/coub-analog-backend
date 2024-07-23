import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { createWriteStream } from 'fs'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'

@Resolver()
export class CoubResolver {
	@Mutation(() => Boolean)
	async uploadFile(
		@Args({ name: 'file', type: () => GraphQLUpload })
		{ createReadStream, filename }: FileUpload
	): Promise<boolean> {
		return new Promise(async (resolve, reject) =>
			createReadStream()
				.pipe(createWriteStream(`./uploads/${filename}`))
				.on('finish', () => resolve(true))
				.on('error', () => reject(false))
		)
	}

	// async saveImage(image: {
	// 	createReadStream: () => any
	// 	filename: string
	// 	mimetype: string
	// }): Promise<string> {
	// 	if (!image || !['image/jpeg'].includes(image.mimetype)) {
	// 		throw new BadRequestException('Invalid format for image')
	// 	}
	// 	const imageName = `${Date.now()}${extname(image.filename)}`
	// 	const imagePath = `/avatars/${imageName}`
	// 	const stream = image.createReadStream()
	// 	const outputPath = `public${imagePath}`
	// 	const writeStream = createWriteStream(outputPath)
	// 	stream.pipe(writeStream)

	// 	await new Promise((resolve, reject) => {
	// 		stream.on('end', resolve)
	// 		stream.on('error', reject)
	// 	})

	// 	return imagePath
	// }
}
