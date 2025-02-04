// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
// with the License. A copy of the License is located at
//
// http://aws.amazon.com/apache2.0/
//
// or in the "LICENSE.txt" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
// OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions and
// limitations under the License.
import React from 'react';
import { Link as InternalLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"

// UI Elements
import { useTheme } from '@mui/material/styles';

// Icons
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import DangerousIcon from '@mui/icons-material/Dangerous';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import HelpTooltip from '../components/HelpTooltip'
import { Link } from "@awsui/components-react";
import { useState } from '../store'

function ClusterFailedHelp({clusterName}) {
  let navigate = useNavigate();

  const clusterPath = ['clusters', 'index', clusterName];
  const headNode = useState([...clusterPath, 'headNode']);
  let href = `/clusters/${clusterName}/logs`;
  let cfnHref = `/clusters/${clusterName}/stack-events?filter=_FAILED`;
  if(headNode)
    href += `?instance=${headNode.instanceId}`

  return <HelpTooltip>
    Stack failed to create, see <InternalLink to={cfnHref}>CloudFormation Stack Events</InternalLink> 
    &nbsp; or &nbsp;
    <Link onFollow={(e) => {navigate(href); e.preventDefault()}}>Cluster Logs</Link>
    &nbsp; to see why.
  </HelpTooltip>
}

export default function Status({status, cluster}) {
  const failedStatuses = new Set(['CREATE_FAILED', 'DELETE_FAILED', 'UPDATE_FAILED']);
  const theme = useTheme();

  const aligned = (icon, text, color) => <div style={{
    color: color || 'black',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  }}>
    {icon}
    <span style={{display: 'inline-block', paddingLeft: '10px'}}> {text ? text.replaceAll("_", " ") : "<unknown>"}</span>
    { cluster && failedStatuses.has(status) && <ClusterFailedHelp clusterName={cluster.clusterName} />  }
  </div>
    const statusMap = {"CREATE_IN_PROGRESS": aligned(<CircularProgress color='info' size={15} />, status, theme.palette.info.main),
      "CREATE_COMPLETE": aligned(<CheckCircleOutlineIcon />, status, theme.palette.success.main),
      "CREATE_FAILED": aligned(<DangerousIcon />, status, theme.palette.error.main),
      "DELETE_IN_PROGRESS": aligned(<CircularProgress size={15} color='error' />, status, theme.palette.error.main),
      "DELETE_FAILED": aligned(<NotInterestedIcon />, status, theme.palette.error.main),
      "RUNNING": aligned(<CheckCircleOutlineIcon />, status, theme.palette.success.main),
      "STOPPED": aligned(<CancelIcon />, status, theme.palette.error.main),
      "STOP_REQUESTED": aligned(<CircularProgress size={15} color='error' />, status, theme.palette.error.main),
      "UPDATE_FAILED": aligned(<DangerousIcon />, status, theme.palette.error.main),
      "UPDATE_IN_PROGRESS": aligned(<CircularProgress color='info' size={15} />, status, theme.palette.info.main),
      "UNKNOWN": aligned(<CircularProgress size={15} color='info' />, status, theme.palette.info.main),
      "UPDATE_COMPLETE": aligned(<CheckCircleOutlineIcon />, status, theme.palette.success.main),};
  return status in statusMap ? statusMap[status] : <span>{status ? status.replaceAll("_", " ") : "<unknown>"}</span>;
}
