import * as d3 from 'd3';
import _ from 'lodash';
import * as React from 'react';

import { IPath } from '#app/utils/interface';

interface IProps {
  links: any[];
  selectedPaths: any[];
  onUpdateLinks: () => void;
  onMouseInLink: (d, event) => void;
  onMouseOut: () => void;
}

const edgeZhMapping = new Map<string, string>([
  ['e_ent_tel', '电话'],
  ['e_group', '分组']
]);

export default class Links extends React.Component<IProps, {}> {
  ref: SVGGElement;

  componentDidMount() {
    this.linkRender(this.props.links, this.props.selectedPaths);
  }

  componentDidUpdate(prevProps) {
    const { links } = this.props;
    if (links.length < prevProps.links.length) {
      const removeLinks = _.differenceBy(
        prevProps.links,
        links,
        (v: any) => v.id,
      );
      removeLinks.forEach(removeLink => {
        const id = removeLink.uuid;
        d3.select('#text-path-' + id).remove();
        d3.select('#text-marker' + id).remove();
        d3.select('#text-marker-id' + id).remove();
      });
    } else {
      this.linkRender(this.props.links, this.props.selectedPaths);
    }
  }

  getNormalWidth = d => {
    const { selectedPaths } = this.props;
    return selectedPaths.map(path => path.id).includes(d.id) ? 3 : 2;
  };

  // 将edge的schema英文描述替换为中文
  linkNameMapping(links: IPath[]) {
    links.forEach((item: IPath) => {
      // 通过 edgeZhMapping 映射中文值
      const edgeName = edgeZhMapping.get(item.type);
      if (edgeName != null) {
        item.type = edgeName;
      }
    });
    return links;
  }

  linkRender(links: IPath[], selectedPaths: IPath[]) {
    const self = this;
    const selectPathIds = selectedPaths.map(node => node.id);

    // 查看links信息
    // console.log(`links1=${JSON.stringify(this.linkNameMapping(links))}`);
    // 将links中的边type替换为中文描述,暂时不启用该功能,看后续需求
    //this.linkNameMapping(links);

    d3.select(this.ref)
      .selectAll('path')
      .data(links)
      .classed('active-link', (d: IPath) => selectPathIds.includes(d.id))
      .enter()
      .append('svg:path')
      .attr('pointer-events', 'visibleStroke')
      .attr('class', 'link')
      .classed('ring', (d: IPath) => d.source.name === d.target.name)
      .style('fill', 'none')
      .style('stroke', '#595959')
      .style('stroke-width', 2)
      .on('mouseover', function(d) {
        self.props.onMouseInLink(d, d3.event);
        d3.select(this)
          .classed('hovered-link', true)
          .style('stroke-width', 3);
      })
      .on('mouseout', function() {
        self.props.onMouseOut();
        d3.select(this)
          .classed('hovered-link', false)
          .style('stroke-width', self.getNormalWidth);
      })
      .attr('id', (d: any) => 'text-path-' + d.uuid);

    d3.select(this.ref)
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'text')
      .attr('id', (d: any) => 'text-marker-id' + d.uuid)
      .append('textPath')
      .attr('id', (d: any) => 'text-marker' + d.uuid)
      .attr('class', 'textPath');

    if (this.ref) {
      this.props.onUpdateLinks();
    }
  }

  render() {
    return (
      <g className="links" ref={(ref: SVGTextElement) => (this.ref = ref)} />
    );
  }
}
