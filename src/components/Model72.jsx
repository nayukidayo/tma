import Model from './Model'

export default function Model72({ setModel }) {
  const getRemoteModel = url => {
    return tmImage.load(url + 'model.json', url + 'metadata.json')
  }

  const getLocalModel = obj => {
    return tmImage.loadFromFiles(
      obj['model.json'],
      obj['weights.bin'] || obj['model.weights.bin'],
      obj['metadata.json']
    )
  }

  return (
    <Model
      getRemoteModel={getRemoteModel}
      getLocalModel={getLocalModel}
      setModel={setModel}
    />
  )
}
