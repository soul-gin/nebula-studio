import { Button, Form, Select } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';

import { Modal } from '#assets/components';
import { IDispatch, IRootState } from '#assets/store';

import ImportNodes from './ImportNode';
import './index.less';

const Option = Select.Option;
const FormItem = Form.Item;

const mapState = (state: IRootState) => ({
  host: state.nebula.host,
  username: state.nebula.username,
  password: state.nebula.password,
  spaces: state.nebula.spaces,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  clearNodes: () =>
    dispatch.explore.update({
      nodes: [],
      links: [],
    }),
  updateSpace: space => {
    dispatch.nebula.update({
      currentSpace: space,
    });
  },
});

type IProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;
class Control extends React.Component<IProps, {}> {
  importNodesHandler;
  componentDidMount() {
    const { host, username, password } = this.props;
    this.props.asyncGetSpaces({
      host,
      username,
      password,
    });
  }

  render() {
    const { spaces } = this.props;

    return (
      <div className="control">
        <FormItem className="left" label="Spaces: ">
          <Select onChange={this.props.updateSpace as any}>
            {spaces.map(space => (
              <Option value={space} key={space}>
                {space}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem className="right">
          <Button type="default" onClick={this.props.clearNodes}>
            {intl.get('explore.clear')}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (this.importNodesHandler) {
                this.importNodesHandler.show();
              }
            }}
          >
            {intl.get('explore.importNode')}
          </Button>
          <Modal
            handlerRef={handler => (this.importNodesHandler = handler)}
            footer={null}
          >
            <ImportNodes handler={this.importNodesHandler} />
          </Modal>
        </FormItem>
      </div>
    );
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Control);