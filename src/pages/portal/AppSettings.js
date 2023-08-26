import React, { useContext, useState, useEffect } from "react";
import "../../css/portal/AppSettings.css"; // Import the CSS file for styling (see Step 3)
import { AccountContext } from "../../AccountContext";
import Loading from "../../Loading";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const AppSettings = () => {
  const { isAppSettingsOpen, setIsAppSettingsOpen, data, setData, chain_id, account } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState(false);
  const [appsEnabled, setAppsEnabled] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        if (account && (chain_id ==='Origintrail Parachain Testnet' || chain_id ==='Origintrail Parachain Mainnet')) {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?account=${account}&network=${chain_id}`
          );
          await setData(response.data);
          for(let i = 0; i < response.data.apps_enabled.length; i++){
            setAppsEnabled((prevFormData) => ({
              ...prevFormData,
              [response.data.apps_enabled[i].app_name]: response.data.apps_enabled[i].checked,
            }));
          }

        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [account]);

  const applyAppSettings = async () => {
    // Perform the POST request using the entered value
    try {
      setIsLoading(true)
      const response = await axios.get(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?account=${account}&network=${chain_id}&enable_apps=${JSON.stringify(appsEnabled)}`
      );
      await setData(response.data);
      setIsLoading(false)
      setIsAppSettingsOpen(false)
    } catch (error) {
      console.error(error); // Handle the error case
    }
    //setData('')
  };

  if (isLoading) {
    return <Loading />;
  }

  const applySearch = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/app-settings?app_search=${inputValue}`
      );
      console.log(`SEARCH RESULT: ${JSON.stringify(response.data)}`)
      await setData(response.data);
      setIsLoading(false)
    } catch (error) {
      console.error(error); // Handle the error case
    }
  };


  const handleInputChange = (event) => {
    const { name, checked } = event.target;
    setAppsEnabled((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <div>
      <div className='apps-filter'></div>
      {data ? (<div>
        <div className='app-search'>
        <form onSubmit={applySearch}>
          <button type="submit" className="app-search-button">Search</button>
          <input
                  type="text"
                  placeholder='Search an app...'
                  onChange={(event) => handleSearchChange(event)}
                  value={inputValue}
                  />    
          </form>
        </div>
        <form onSubmit={applyAppSettings}>
          <div className='apps-list'>
          {data.search_result ? (<div>{data.search_result.map((result) => (
            <div key={result.app_name} className='app-list-item'>
              <input
                  type="checkbox"
                  name={result.app_name}
                  defaultChecked={result.checked}
                  onChange={(event) => handleInputChange(event)}
                  onLoad={(event) => handleInputChange(event)}
                  />
                  <label>{result.app_name}</label>
            </div>
          ))}</div>) : (<div>{data.apps_enabled.map((app) => (
            <div key={app.app_name} className='app-list-item'>
              <input
                  type="checkbox"
                  name={app.app_name}
                  defaultChecked={app.checked}
                  onChange={(event) => handleInputChange(event)}
                  onLoad={(event) => handleInputChange(event)}
                  />
                  <label>{app.app_name}</label>
            </div>
          ))}</div>)}
          </div>
          <button className="app-settings-button">Save</button>
        </form>
      </div>) :
      (<div></div>)}
    </div>
  );
};

export default AppSettings;