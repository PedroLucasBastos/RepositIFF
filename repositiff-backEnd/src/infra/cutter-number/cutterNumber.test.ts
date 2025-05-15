// cutter.test.ts
import { describe, it, expect, vi } from 'vitest'
import { exec } from 'child_process'
import path from 'path'



export function gerarCodigoCutter(nomeAutor: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, 'cutter-number/cutter-sanborn.py')
        console.log(scriptPath)
        const comando = `python3 ${scriptPath} "${nomeAutor}"`
        // const comando = `python3 ./infra/cutter-number/cutter-sanborn.py "${nomeAutor}"`

        exec(comando, (error, stdout, stderr) => {
            if (error) {
                reject(`Erro ao executar script: ${error.message}`)
                return
            }
            if (stderr) {
                reject(`Erro no script Python: ${stderr}`)
                return
            }

            resolve(stdout.trim())
        })
    })
}


// mock do 'child_process'
vi.mock('child_process', () => {
    return {
        exec: vi.fn()
    }
})

describe('gerarCodigoCutter', async () => {
    it('retorna o código gerado corretamente', async () => {
        const mockedExec = exec as unknown as ReturnType<typeof vi.fn>

        // Simula a saída do script Python
        mockedExec.mockImplementation((_cmd, callback) => {
            callback(null, 'A123\n', '') // stdout simulado
        })

        const result = await gerarCodigoCutter('Ana')
        expect(result).toBe('A123')
    })

    it('lida com erro na execução do script', async () => {
        const mockedExec = exec as unknown as ReturnType<typeof vi.fn>

        mockedExec.mockImplementation((_cmd, callback) => {
            callback(new Error('Falha'), '', '')
        })

        await expect(gerarCodigoCutter('João')).rejects.toMatch('Erro ao executar script: Falha')
    })

    it('lida com stderr do script', async () => {
        const mockedExec = exec as unknown as ReturnType<typeof vi.fn>

        mockedExec.mockImplementation((_cmd, callback) => {
            callback(null, '', 'Erro interno no Python')
        })

        await expect(gerarCodigoCutter('Maria')).rejects.toMatch('Erro no script Python: Erro interno no Python')
    })
})
