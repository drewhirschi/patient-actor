import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
    const adapter = new PrismaPg({
        connectionString: process.env.NEON_POSTGRES_PRISMA_URL
    })
    return new PrismaClient({ adapter })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

