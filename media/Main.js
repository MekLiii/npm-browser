;(function () {
  try {
    const vscode = acquireVsCodeApi()

    let input = document.getElementById('input')
    const button = document.getElementById('search')
    const root = document.getElementById('root')

    let loading = false
    const installPackage = name => {
      console.log(name)
      vscode.postMessage({
        command: 'npm-browser.openTerminal',
        text: name
      })
    }

    const fetchData = async () => {
      loading = true
      root.innerHTML = ''
      const response = await fetch(
        `https://api.npms.io/v2/search?q=${input.value}`
      )
      const data = await response.json()
      if (data.results !== null) {
        data.results.forEach(item => {
          const listItem = document.createElement('div')
          listItem.classList.add('list-item')
          listItem.innerHTML = ` <div class="container"><h3>${item.package.name} ${item.package.version}</h3><button id="install-button">Install</button></div>
          <p>${item.package.description}</p>
          <a href="${item.package.links.npm}" class="link">Link</a>
        `
          root.appendChild(listItem)
          const installButton = listItem.querySelector('#install-button')
          installButton.addEventListener('click', () => {
            installPackage(item.package.name)
          })
        })
      }
    }
    input.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        fetchData()
      }
    })
    if (loading) {
      root.innerHTML = `<div class="loader"></div>`
    }
    button &&
      button.addEventListener('click', () => {
        fetchData()
      })
  } catch (err) {
    console.log(err)
  }
})()
