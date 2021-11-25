import React, { Component } from 'react'
import { Rate, Typography, Button, message } from 'antd';

import './index.css'
import api from '../../api';

const { Title, Paragraph, Text } = Typography;

export default class CandidateRate extends React.Component {
    constructor(props) {
        super(props)
        const toolTips = {
            grammaticalityScore: [ 'unacceptable', 'lots of grammatical errors and unable to infer actual meaning', 'partially grammatical errors but able to infer actual meaning', 'no grammatical errors' ],
            answerabilityScore: [  'all important information is missing', 'most of the important information is missing an unable to infer the answer', 'most of the important information is present able to infer the answer', 'all important information is present' ],
            relevanceScore: [ 'totally irrelevant', 'mostly irrelevant and unable to answer the question', 'slightly irrelevant but able to answer the question', 'completely relevant'  ]
        }
        const scoreLeadings = {
            grammaticalityScore: 'Grammaticality score',
            answerabilityScore: 'Answerability score',
            relevanceScore: 'Relevance score'
        }
        this.state = {
            authorizationCode: localStorage.getItem('authorizationCode'),
            candidatePk: this.props.candidatePk,
            defaultGrammaticalityScore: 0,
            defaultAnswerabilityScore: 0,
            defaultRelevanceScore: 0,
            grammaticalityScore: 0,
            answerabilityScore: 0,
            relevanceScore: 0,
            toolTips: toolTips,
            scoreLeadings: scoreLeadings
        }
    }
  
    handleGrammaticalityChange = value => {
        this.setState({
            grammaticalityScore: value,
        });
    }

    handleAnswerabilityChange = value => {
        this.setState({
            answerabilityScore: value,
        });
    };

    handleRelevanceChange = value => {
        this.setState({
          relevanceScore: value,
        });
    };

    handleButtonClick = () => {
        const body = {
            authorizationCode: this.state.authorizationCode,
            candidates: [ this.state.candidatePk ],
            grammaticality: [ this.state.grammaticalityScore ],
            answerability: [ this.state.answerabilityScore ],
            relevance: [ this.state.relevanceScore ]
          };
  
          const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
              bodyEncode.append(key, body[key]);
          });

        fetch(api.ratecandidate, {
            method: 'POST',
            body: bodyEncode,
            mode: 'cors'
          })
          .catch(err => {
              message.error('request error!');
              console.log(err)
          })
          .then(res => res.json())
          .then(res => {
              if(res['status']) {
                message.success('submit successfully!');
              } else {
                message.error(res.message);
              }
          });        
    }

    render() {
      const { toolTips, scoreLeadings } = this.state;
      const handles = [ this.handleGrammaticalityChange, this.handleAnswerabilityChange, this.handleRelevanceChange ];
      const scoreKeys = [ 'grammaticalityScore', 'answerabilityScore', 'relevanceScore' ];
      return (
        <div>
        {scoreKeys.map((scoreKey, index) => (
            <span>
                <Typography>
                    <Text strong = {true}>{scoreLeadings[scoreKey]}</Text>
                </Typography>
                <Rate count = {4} tooltips={toolTips[scoreKey]} onChange={handles[index]} value={this.state[scoreKey]} key={index}/>
                {this.state[scoreKey] ? <span className="ant-rate-text">{toolTips[scoreKey][this.state[scoreKey] - 1]}</span> : ''}
            </span>
        ))}
        <br />
        <Button type="primary" onClick={this.handleButtonClick}>Submit</Button>
        </div>
      );
    }
  }