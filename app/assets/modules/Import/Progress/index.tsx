import { Icon, Popconfirm, Steps } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';

import { IDispatch, IRootState } from '#assets/store';

const { Step } = Steps;

const mapState = (state: IRootState) => ({
  activeStep: state.importData.activeStep,
  currentStep: state.importData.currentStep,
  isImporting: state.importData.isImporting,
});

const mapDispatch = (dispatch: IDispatch) => ({
  updateActiveStep: step => {
    dispatch.importData.update({
      activeStep: step,
    });
  },
  resetAllConfig: dispatch.importData.resetAllConfig,
});

interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {}

class Progress extends React.Component<IProps, {}> {
  handleSwitchStep = step => {
    const { currentStep, isImporting } = this.props;
    if (!isImporting) {
      return;
    }
    if (step <= currentStep) {
      this.props.updateActiveStep(step);
    }
  };

  stepsStatus = index => {
    const { currentStep, isImporting } = this.props;
    if (!isImporting) {
      return 'wait';
    }
    return index <= currentStep ? 'finish' : 'wait';
  };

  render() {
    const steps = [
      {
        title: intl.get('import.init'),
      },
      {
        title: intl.get('import.upload'),
      },
      {
        title: intl.get('import.vertex'),
      },
      {
        title: intl.get('import.edge'),
      },
      {
        title: intl.get('common.import'),
      },
    ];
    const { activeStep, isImporting } = this.props;
    return (
      <div className="nav-import">
        <Steps
          type="navigation"
          onChange={this.handleSwitchStep}
          current={activeStep}
        >
          {steps.map((step, index) => (
            <Step
              title={step.title}
              key={index}
              status={this.stepsStatus(index)}
            />
          ))}
        </Steps>
        {isImporting && (
          <Popconfirm
            placement="left"
            title={intl.get('import.clearAllConfigInfo')}
            onConfirm={this.props.resetAllConfig}
            okText="Yes"
            cancelText="No"
          >
            <Icon type="delete" className="rest-import" />
          </Popconfirm>
        )}
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(Progress);