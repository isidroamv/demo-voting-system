const fs = require('fs');
import { compile } from "solc";

const source = fs.readFileSync('./contracts/Contract', "utf8");

export default compile(source, 1).contracts[":Contract"];
