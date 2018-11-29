import React, { Component } from 'react'
import { Loader, Icon } from 'semantic-ui-react'

const AsyncIndicator = ({ status: { isLoading, isLoaded, error } }) => {
  return (
    <div>
      {error && (
        <div style={{ textAlign: 'right', color: 'red', padding: 10 }}>
          <Icon name="close" />
          Error
          <div>{error.message}</div>
        </div>
      )}
      {isLoading && (
        <div style={{ textAlign: 'right', color: 'gray', padding: 10 }}>
          <Loader active inline size="mini" style={{ marginRight: 5 }} />
          Saving
        </div>
      )}
      {isLoaded && (
        <div style={{ textAlign: 'right', color: 'green', padding: 10 }}>
          <Icon name="check" />
          Saved
        </div>
      )}
    </div>
  )
}

export { AsyncIndicator }
