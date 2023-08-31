import React, { useContext, useState, useEffect } from 'react'
import '../../css/build/settings.css'
import { AccountContext } from '../../AccountContext'
import Loading from '../../Loading'
import axios from 'axios'
let ext

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

const Settings = () => {
  const { isCreateAppOpen, setCreateAppPopup, data, setData, setAppIndex, account, chain_id, app_index } = useContext(AccountContext)
  const [isOpenDeleteKey, setIsDeleteKey] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [limit, setLimit] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isDeleteApp, setIsDeleteApp] = useState(false)
  const [isEditAppOpen, setOpenEditApp] = useState(false)
  const [filterInput, setFilterInput] = useState({
    ual: "",
    txn_id: "",
    app_name: "",
    progress: "",
    txn_type: "",
    limit: "100",
  });

  useEffect(() => {
    async function fetchData () {
      try {
        if (account) {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/build/settings?public_address=${account}&network=${chain_id}`
          )
          setData(response.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setData('')
    fetchData()
  }, [account,chain_id])

  const openCreateAppPopup = () => {
    setCreateAppPopup(true)
  }

  const closeCreateAppPopup = () => {
    setCreateAppPopup(false)
  }

  const handleLimitChange = (e) => {
    setLimit(e.target.value)
  }

  const submitApp = async e => {
    try {
      const fetchData = async () => {
        try {
          e.preventDefault()
          const response = await axios.get(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/build/create-app?public_address=${account}&network=${chain_id}&app_name=${e.target.app_name.value}&app_description=${e.target.app_description.value}&built_by=${e.target.built_by.value}&website=${e.target.website.value}&github=${e.target.github.value}&key_count=${e.target.key_count.value}`
          )
            setData(response.data)
            setCreateAppPopup(false);
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchData()
    } catch (error) {
      console.error(error) // Handle the error case
    }
  }

  const clickAppTab = async (app_name,index) => {
    try {
      const fetchData = async () => {
          try {

          await setAppIndex(index)
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/build/settings?public_address=${account}&network=${chain_id}&app_name=${app_name}`
          )
              setData(response.data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchData()
    } catch (error) {
      console.error(error) // Handle the error case
    }
  }

  const handleCreateKey = async (index) => {
    // Perform the POST request using the entered value
    try {
      setLoading(true)
          const fetchData = async () => {
              const response = await axios.get(
                  `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/build/create-key?public_address=${account}&network=${chain_id}&app_name=${data.appNames[app_index].app_name}&key_count=1`
              )
              setData(response.data)
              setLoading(false)
          }

        fetchData()
    } catch (error) {
      console.error(error) // Handle the error case
    }
  }

  const openPopupDeleteKey = (api_key) => {
    setInputValue(api_key)
    setIsDeleteKey(true)
    }

    const openPopupDeleteApp = (app_name) => {
        setInputValue(app_name)
        setIsDeleteApp(true)
    }

    const openEditApp = (app_name) => {
        setInputValue(app_name)
        setOpenEditApp(true)
    }

  const closePopupDeleteKey = () => {
    setIsDeleteKey(false)
    }

    const closePopupDeleteApp = () => {
        setIsDeleteApp(false)
    }

    const closeEditApp = () => {
        setOpenEditApp(false)
    }

  const handleDeleteKey = async (e) => {
    e.preventDefault()
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          const response = await axios.get(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/build/delete-key?public_address=${account}&network=${chain_id}&delete_key=${inputValue}`
          )
          setData(response.data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchData()
      setIsDeleteKey(false)
      setInputValue('')

    } catch (error) {
      console.error(error) // Handle the error case
    }
    }

    const handleDeleteApp = async (e) => {
        e.preventDefault()
        // Perform the POST request using the entered value
        try {
            const fetchData = async () => {
                try {
                    const response = await axios.get(
                        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/build/delete-app?public_address=${account}&network=${chain_id}&app_name=${inputValue}`
                    )
                    setData(response.data)
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }

            fetchData()
            setIsDeleteApp(false)
            setInputValue('')

        } catch (error) {
            console.error(error) // Handle the error case
        }
    }

    const handleEditApp = async (e) => {
        e.preventDefault()
        // Perform the POST request using the entered value
        try {
            const fetchData = async () => {
                try {
                    const response = await axios.get(
                        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/build/delete-app?public_address=${account}&network=${chain_id}&app_name=${inputValue}`
                    )
                    setData(response.data)
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }

            fetchData()
            setOpenEditApp(false)
            setInputValue('')

        } catch (error) {
            console.error(error) // Handle the error case
        }
    }

  const handleFilterInput = (e) => {
    const { name, value } = e.target;
    setFilterInput((filterInput) => ({
      ...filterInput,
      [name]: value,
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    // Perform the POST request using the entered value
    try {
      const fetchFilteredData = async () => {
        try {
          console.log(filterInput);

          const response = await axios.get(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?account=${account}&network=${chain_id}&ual=${filterInput.ual}&app_name=${filterInput.app_name}&txn_id=${filterInput.txn_id}&progress=${filterInput.progress}&request=${filterInput.request}&limit=${filterInput.limit}`
            );
          setData(response.data)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchFilteredData();
    } catch (error) {
      console.error(error); // Handle the error case
    }
    //setData('')
  };

    if (isLoading) {
        return (
            <Loading />
        )
    }

  if (!account) {
    return (
      <div className='keys'>
        <header className='keys-header'>
          Please connect your wallet to open your developer settings.
        </header>
      </div>
    )
   }

    if (chain_id !== 'Origintrail Parachain Testnet' && chain_id !== 'Origintrail Parachain Mainnet') {
        return (
            <div className="keys">
                <header className="keys-header">
                    Connected with an unsupported chain. Please switch to Origintrail Parachain Testnet or Mainnet.
                </header>
            </div>
        )
    }

    if (data && JSON.stringify(data.appRecords) === '[]') {
    return (
      <div className='keys'>
        <header className='keys-header'>
          You do not have any applications. Click the button below to create one.
        </header>
      <button onClick={openCreateAppPopup} className="create-app-button">
        Create App
      </button>
        {isCreateAppOpen && (
        <div className='popup-overlay'>
          <div className='create-app-popup-content'>
            <button className='keys-close-button' onClick={closeCreateAppPopup}>
              X
            </button>
            <form className='create-app-form' onSubmit={submitApp}>
              <div className="cf-app-name">
                App Name<br></br>
                <input
                type="text"
                required
                name='app_name'
              />
              </div>
              <div className="cf-app-description">
                App Description
                <br></br>
                <textarea 
                type="text"
                name='app_description'
              />
              </div>
              <div className="cf-built-by">
                Built by
                <br></br>
                <input
                type="text"
                name='built_by'
              />
              </div>
              <div className="cf-website">
                Project Website
                <br></br>
                <input
                type="text"
                name='website'
              />
              </div>
              <div className="cf-github">
                Github Repo
                <br></br>
                <input
                type="text"
                name='github'
              />
              </div>
              <div className="cf-keys-to-create">
              {`Create ${limit} API Key(s)`}
                <br></br>
                <input
                  name="key_count"
                  type="range"
                  min="1"
                  max="5"
                  value={limit}
                  onChange={handleLimitChange}
                  style={{ cursor: "pointer", width: "350px" }}
                />
              </div>
              <br></br>
              <button type='submit' className='submit-app-button'>Create</button>
            </form>
          </div>
        </div>
      )}
      </div>
    )
  }

  return (
    <div className='keys'>
      {isOpenDeleteKey && (
        <div className='popup-overlay'>
          <div className='keys-popup-content'>
            <button className='keys-close-button' onClick={closePopupDeleteKey}>
              X
            </button>
            <form onSubmit={handleDeleteKey}>
              <label>
                Are you sure you want to delete this key?
              </label>
              <button type='submit'>Yes</button>
            </form>
          </div>
        </div>
          )}
          {isDeleteApp && (
              <div className='popup-overlay'>
                  <div className='keys-popup-content'>
                      <button className='keys-close-button' onClick={closePopupDeleteApp}>
                          X
                      </button>
                      <form onSubmit={handleDeleteApp}>
                          <label>
                              Are you sure you want to delete this App? You will lose all txn data for this app.
                          </label>
                          <button type='submit'>Yes</button>
                      </form>
                  </div>
              </div>
          )}
          {isEditAppOpen && (
              <div className='popup-overlay'>
                  <div className='keys-popup-content'>
                      <button className='keys-close-button' onClick={closeEditApp}>
                          X
                      </button>
                      <form onSubmit={handleEditApp}>
                          <div className="ea-app-description">
                              App Description
                              <br></br>
                              <input
                                  type="text"
                                  name='app-description'
                              />
                          </div>
                          <div className="ea-built-by">
                              Built by
                              <br></br>
                              <input
                                  type="text"
                                  name='built-by'
                              />
                          </div>
                          <div className="ea-website">
                              Website
                              <br></br>
                              <input
                                  type="text"
                                  name='website'
                              />
                          </div>
                          <div className="ea-github">
                              Github
                              <br></br>
                              <input
                                  type="text"
                                  name='github'
                              />
                          </div>
                          <button type='submit'>Save</button>
                      </form>
                  </div>
              </div>
          )}
      {data && isCreateAppOpen && (
        <div className='popup-overlay'>
          <div className='create-app-popup-content'>
            <button className='keys-close-button' onClick={closeCreateAppPopup}>
              X
            </button>
            <form className='create-app-form' onSubmit={submitApp}>
              <div className="cf-app-name">
                App Name<br></br>
                <input
                type="text"
                required
                name='app_name'
              />
              </div>
              <div className="cf-app-description">
                App Description
                <br></br>
                <textarea 
                type="text"
                name='app_description'
              />
              </div>
              <div className="cf-built-by">
                Built by
                <br></br>
                <input
                type="text"
                name='built_by'
              />
              </div>
              <div className="cf-website">
                Project Website
                <br></br>
                <input
                type="text"
                name='website'
              />
              </div>
              <div className="cf-github">
                Github Repo
                <br></br>
                <input
                type="text"
                name='github'
              />
              </div>
              <div className="cf-keys-to-create">
              {`Create ${limit} API Key(s)`}
                <br></br>
                <input
                  name="key_count"
                  type="range"
                  min="1"
                  max="5"
                  value={limit}
                  onChange={handleLimitChange}
                  style={{ cursor: "pointer", width: "350px" }}
                />
              </div>
              <br></br>
              <button type='submit' className='submit-app-button'>Create</button>
            </form>
          </div>
        </div>
      )}
      {data ? (
        <header>
                  {data.appNames.map((record, index) => (
            <button 
              key={record.app_name} 
              className={`build-settings-header-${index}A`} 
              onClick={() => clickAppTab(record.app_name,index)}
              style={app_index === index ? ({border: "1px solid #6168ED", borderRight: '1px solid #FFFFFF',borderTop: '1px solid #6168ED', zIndex: 300}): ({})}
              >
              {record.app_name} 
            </button>
          ))}
          <div className="build-settings-form">
            <form onSubmit={handleFilterSubmit}>
              <div>
                Transaction ID<br></br>
                <input
                  type="text"
                  name="txn_id"
                  value={filterInput.txn_id}
                  onChange={handleFilterInput}
                  maxLength="100"
                />
              </div>
              <br></br>
              <div>
                UAL<br></br>
                <input
                  type="text"
                  name="ual"
                  value={filterInput.ual}
                  onChange={handleFilterInput}
                  maxLength="100"
                />
              </div>
              <br></br>
              <div className="portal-limit">
                Limit: {filterInput.limit}
                <br></br>
                <input
                  name="limit"
                  type="range"
                  min="0"
                  max="5000"
                  value={filterInput.limit}
                  onChange={handleFilterInput}
                  style={{ cursor: "pointer", width: "75%" }}
                />
              </div>
              <br></br>
              <div className="radios-type">
                Type:<br></br>
                <input
                  type="radio"
                  name="request"
                  value="All"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                All<br></br>
                <input
                  type="radio"
                  name="request"
                  value="Create"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Creations<br></br>
                <input
                  type="radio"
                  name="request"
                  value="Update"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Updates<br></br>
                <input
                  type="radio"
                  name="request"
                  value="Transfer"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Transfers<br></br>
                <input
                  type="radio"
                  name="request"
                  value="Query"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Queries<br></br>
                <input
                  type="radio"
                  name="request"
                  value="get"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                gets<br></br>
                <input
                  type="radio"
                  name="request"
                  value="getLatestStateIssuer"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                getLatestStateIssuers<br></br>
                <input
                  type="radio"
                  name="request"
                  value="getOwner"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                getOwners<br></br>
                <input
                  type="radio"
                  name="request"
                  value="getState"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                getStates<br></br>
                <input
                  type="radio"
                  name="request"
                  value="getStateIssuer"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                getStateIssuers<br></br>
                </div>
                <div className="radios-status">
                Status:<br></br>
                <input
                  type="radio"
                  name="progress"
                  value="ALL"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                All<br></br>
                <input
                  type="radio"
                  name="progress"
                  value="COMPLETE"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Complete<br></br>
                <input
                  type="radio"
                  name="progress"
                  value="PENDING"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Pending<br></br>
                <input
                  type="radio"
                  name="progress"
                  value="REJECTED"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Rejected<br></br><br></br>
              </div>
              <button type="submit">Apply</button>
              <br></br>
            </form>
          </div>
          <div className="app-nav">
            <button type="submit" onClick={openCreateAppPopup} className="create-app-button">
              Create App
            </button>
          </div>
          <div className='build-settings-header-0B'
            style = {app_index >= 0 ? ({border: '1px solid #6168ED'}): ({})}
          >
            <div className='app-details'>
                          <button onClick={() => openEditApp(data.appNames[app_index].app_name)}>
                              <img alt='pencil' src="https://img.icons8.com/ios/30/000000/pencil.png" />
                          </button>
                          <button >
                              <img alt='chart' src="https://img.icons8.com/ios/30/000000/line-chart.png" />
                          </button>
                          <button onClick={() => openPopupDeleteApp(data.appNames[app_index].app_name)}>
                              <img alt='trash' src="https://img.icons8.com/material-rounded/30/000000/trash.png" />
                          </button>
                          <br></br>
              <div className='app-usage'>
                {`Users`}<br></br> <span>{data.users.length ? (data.users.length) : (0) }</span>
              </div>
              <div className='app-usage'>
                {`Requests`}<br></br> <span>{data.app_txns.length ? (data.app_txns.length) : (0) }</span>
              </div>
              <div className='app-usage'>
                {`Assets`}<br></br> <span>{data.assets ? (data.assets) : (0) }</span>
              </div>
              <br></br>
              
              <div className='app-description'>
                {data.appRecords[0].app_description ? (data.appRecords[0].app_description) : ('No description available.') } <br></br>
              </div>
              <div className='app-built-by'>
                {`Built by:`} {data.appRecords[0].built_by ? (data.appRecords[0].built_by) : ('') } 
              </div>
              <div className='app-website'>
                {`Website:`} {data.appRecords[0].website ? (data.appRecords[0].website) : ('') }
              </div>
              <div className='app-github'>
                {`Github:`} {data.appRecords[0].github ? (data.appRecords[0].github) : ('') }
              </div>
            </div>
            
            <div className='key-form'>
              <div className='key-text'>
                {`${data.keyRecords.length}/5 Active Keys`}
                
              </div>
              <form onSubmit={() => handleCreateKey(app_index)} className='app-text'>
                <button type='submit'>Create Key</button>
              </form>
              <div className='msg-text'>
                {data.msg}
              </div>
            </div>
          </div>
          <table className='keysTable'>
              <thead>
                <tr>
                  <th>API Token</th>
                  <th>Access</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.keyRecords.map(record => (
                  <tr key={record.api_key}>
                    <td>{record.api_key}</td>
                    <td>{record.access}</td>
                    <td>
                      <button onClick={() => openPopupDeleteKey(record.api_key)}>
                        <img alt='trashcan' src="https://img.icons8.com/material-rounded/24/000000/trash.png"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="app-txn-container">
            {data.app_txns.map((txn) => (
              <button
                // onClick={() => openRequestPopup(txn)}
                className="app-txn-record"
                key={txn.txn_id}
              >
                <div className="txn-created-at">{txn.created_at}</div>
                <div className="app-request">
                  {txn.request}
                </div>
                <div className={`${txn.progress}-progress`}>
                  {txn.progress}
                </div>
                <div className="txn-summary">
                {`${txn.app_name}(${txn.txn_id})`}
                </div>
                <div className="txn-ual">
                  {txn.ual}
                </div>
                <div className={`txn-${txn.request}-receiver`}>
                  Receiver:<span>{txn.txn_data ? (JSON.parse(txn.txn_data).receiver) : ('')}</span>
                </div>
                <div className={`txn-${txn.request}-epochs`}>
                  Epochs: {txn.epochs}
                </div>
                <div className="txn-cost">
                  Estimated Cost: {txn.trac_fee}
                </div>
                <div className="txn-description">
                  <span>{txn.txn_description}</span>
                </div>
              </button>
            ))}
          </div>
        </header>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Settings
