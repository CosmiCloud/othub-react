import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/nodeDashboard.css";
import Loading from "../../effects/Loading";
import EstimatedEarnings from "./estimatedEarnings";
import PubsCommited from "./pubsCommited";
import Rewards from "./rewards";
import CumPubsCommited from "./cumPubsCommited";
import CumRewards from "./charts/cumRewards";
import TotalEarnings from "./totalEarnings";
import TotalPubsCommited from "./totalPubsCommited";
import TotalRewards from "./charts/totalRewards";
import TotalStake from "./totalStake";
import TotalDelegations from "./totalDelegations";
import Delegations from "./delegations";
import NodeCommits from "./nodeCommits";
import NodeSettings from "./NodeSettings";
import NetworkDrop from "../../navigation/networkDrop";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

//REACT_APP_SUPPORTED_NETWORKS
const NodeDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const account = localStorage.getItem("account");
  const [nodeFilter, setNodeFilter] = useState("");
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  let [nodes, setNodes] = useState("");
  let [data, setData] = useState("");

  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("DKG Mainnet");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (account && network) {
          const request_data = {
            network: network,
            blockchain: blockchain,
          };

          const response = await axios
            .post(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodes`,
              request_data,
              config
            )
            .then((response) => {
              // Handle the successful response here
              return response.data;
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });

          let nodes = []
          let nodeIds;
          for (const blockchain of nodes) {
            nodeIds = blockchain.nodes.map((item) => item.nodeIds);
            nodes.push(blockchain.nodes)
          }

          setNodeFilter(nodeIds);
          nodes.unshift({ NodeId: nodeIds, tokenName: "All" });
          setNodes(nodes);

          const time_data = {
            timeframe: "All",
            blockchain: blockchain,
            nodeId: nodeIds,
            public_address: account,
          };
          const response1 = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeData`,
            time_data
          );
          setData(response1.data);

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account, blockchain,network]);

  const openNodeSettings = () => {
    setIsNodeSettingsOpen(true);
  };

  const closeNodeSettings = () => {
    setIsNodeSettingsOpen(false);
  };

  if (!account) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please connect your admin wallet to view your nodes.
        </header>
      </div>
    );
  }

  if (
    blockchain !== "Origintrail Parachain Testnet" &&
    blockchain !== "Origintrail Parachain Mainnet" &&
    blockchain !== "Chiado Testnet" &&
    blockchain !== "Gnosis Mainnet"
  ) {
    return (
      <div className="keys">
        <header className="keys-header">
          Connected with an unsupported blockchain. Supported blockchains are:
          <br />
          OriginTrail Parachain Testnet
          <br />
          OriginTrail Parachain Mainnet
          <br />
          Chiado Testnet
          <br />
          Gnosis Mainnet
          <br />
        </header>
      </div>
    );
  }

  if (Number(nodes.length) === 0 && !isLoading) {
    return (
      <div className="keys">
        <header className="keys-header">
          You do not have any nodes on this network.
        </header>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="assets">
        <div className="assets-header">
          <Loading />
        </div>
      </div>
    );
  }

  if (isNodeSettingsOpen) {
    return (
      <div className="popup-overlay">
        <div className="node-settings-popup-content">
          <button
            className="app-settings-close-button"
            onClick={closeNodeSettings}
          >
            X
          </button>
          <NodeSettings />
        </div>
      </div>
    );
  }

  return (
    data &&
    nodes &&
    account && (
      <div className="main">
        <div className="header">
          <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
        </div>
        <div className="nodes-drop-down">
            <select>
              {nodes.map((node) => (
                <option
                  key={node.nodeId}
                  onClick={() => setNodeFilter([node.nodeId])}
                >
                  {node.tokenName}
                </option>
              ))}
            </select>
          </div>
          <div className="notification-button">
            <button type="submit" onClick={openNodeSettings}>
              <strong>Notifications</strong>
            </button>
          </div>
        <div className="window">
          <div className="node-dashboard-small-container-top">
            <TotalStake
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: blockchain,
                  network: network,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div>
          {/* <div className="node-dashboard-small-container-top">
            <TotalRewards
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div> */}
          {/* <div className="node-dashboard-small-container-top">
            <TotalEarnings
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div> */}
          {/* <div className="node-dashboard-small-container-top">
            <TotalPubsCommited
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div> */}
          {/* <div className="node-dashboard-small-container-top">
            <TotalDelegations
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                },
              ]}
            />
          </div> */}
          {/* <div className="ee-chart-container">
            <EstimatedEarnings
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div> */}
          {/* <div className="ee-chart-container">
            <Rewards
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div> */}
          {/* <div className="ee-chart-container">
            <PubsCommited
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div> */}
          {/* <div className="ee-chart-container">
            <CumRewards
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div> */}
          {/* <div className="ee-chart-container">
            <CumPubsCommited
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                  data: data,
                },
              ]}
            />
          </div> */}
          {/* <div className="ee-chart-container">
            <Delegations
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                },
              ]}
            />
          </div> */}
          {/* <div className="node-dashboard-large-container-long">
            <NodeCommits
              data={[
                {
                  nodeId: nodeFilter,
                  blockchain: connected_blockchain,
                  public_address: account,
                },
              ]}
            />
          </div> */}
        </div>
      </div>
    )
  );
};

export default NodeDashboard;
