import Model from './Model'

export default function Model73({ setModel }) {
  const getRemoteModel = async url => {
    const model = speechCommands.create(
      'BROWSER_FFT',
      undefined,
      url + 'model.json',
      url + 'metadata.json'
    )
    await model.ensureModelLoaded()
    return model
  }

  const getLocalModel = async obj => {
    const filesHandler = tf.io.browserFiles([
      obj['model.json'],
      obj['weights.bin'] || obj['model.weights.bin'],
    ])
    const modelArtifacts = await filesHandler.load()
    const metadataStr = await obj['metadata.json'].text()
    
    const model = speechCommands.create(
      'BROWSER_FFT',
      undefined,
      modelArtifacts,
      JSON.parse(metadataStr)
    )
    await model.ensureModelLoaded()
    return model
  }

  return (
    <Model
      getRemoteModel={getRemoteModel}
      getLocalModel={getLocalModel}
      setModel={setModel}
    />
  )
}
