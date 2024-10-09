import axios from "axios";
import {server_origin} from "../../configuration/config";
import {isDevEnv, isDevFeatureEnv, isDevOrLocalEnv} from "../../utils/runtime";
import store from "../../storage";

const feignService = axios.create({
  baseURL: `${server_origin}/apigw/va2roleplay/backend`,
  headers: {'Content-Type': 'application/json'}
});

export function getSpecialASCode() {
  return feignService({
    url: '/agentCompaniesForMvp2/forFilter',
    method: 'GET'
  });
}
