// keystore
import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      json: {},
      loading: false,
    };
  }
  componentDidMount() {}
  create = async () => {
    this.setState({
      loading: true,
    });
    const account = this.props.store.accounts[this.props.store.account_index];
    const res = await helper.createKeystore(
      account.privateKey,
      account.address,
      "123123123"
    );
    this.setState({ loading: false });
    console.log(res);
    const a = {
      version: 3,
      id: "C1CFE33E-3488-4993-B619-50ABD25DD2C3",
      Crypto: {
        ciphertext:
          "f2b745de890b1614ad1e94e4b7463c147a00a39e27465f8242ac279d665db104",
        cipherparams: { iv: "729feac38eb6047c6d606312d5f755e1" },
        kdf: "scrypt",
        kdfparams: {
          r: 8,
          p: 1,
          n: 1024,
          dklen: 32,
          salt:
            "fc951cd27a58ce087a334104fd8b2d6d0d8dd66cb5c994409b90c4fa0ff371ae",
        },
        mac: "ffa99c4abf54a058f8dc0e60d8db2d5cf79cfcefc0402f131e40418cf49ec30f",
        cipher: "aes-128-ctr",
      },
      address: "hbcfsfuaxkxwcqylxkcmel2c6jcjghy15ugs",
    };
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.connect}>
        {this.state.loading ? (
          <Button>
            <CircularProgress />
          </Button>
        ) : (
          <Button onClick={this.create}>create keystore</Button>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
