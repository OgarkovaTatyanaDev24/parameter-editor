import React, { ChangeEvent } from 'react';
import styles from "./app.module.css";

interface Param {
  id: number;
  name: string;
  type: string;
}
interface ParamValue {
  paramId: number;
  value: string;
}
interface NamedParamValue {
  id: number;
  value: string;
  name: string;
}
interface Color {
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}
interface Props {
  params: Param[];
  model: Model;
}
interface State {
  model: Model
  editableParams: NamedParamValue[]
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const avalibleTypes = new Set(['string'])
    const paramMap = props.model.paramValues.reduce((map, param) => map.set(param.paramId, param.value), new Map());
    const editableParams: NamedParamValue[] = props.params.reduce((params: NamedParamValue[], param: Param) => {
      if (avalibleTypes.has(param.type)) params.push({
        id: param.id,
        name: param.name,
        value: paramMap.get(param.id) ? paramMap.get(param.id) : ''
      })
      return params
    }, []);
    this.state = { editableParams: editableParams, model: props.model };
  }
  public getModel(): Model {
    return this.state.model
  }
  setStringParam(paramId: number, paramValue: string) {
    this.setState({
      model: {
        paramValues: this.state.model.paramValues.map(param => {
          return { paramId: param.paramId, value: param.paramId === paramId ? paramValue : param.value }
        }),
        colors: this.state.model.colors,
      },
      editableParams: this.state.editableParams.map(
        param => param.id === paramId ? { id: paramId, value: paramValue, name: param.name } : param
      ),
    })
  }
  render(): React.ReactNode {
    return (
      <div className={styles.container}>
        {this.state.editableParams.map(element => {
          const handleChange = (e: ChangeEvent<HTMLInputElement>) => this.setStringParam(element.id, e.target.value)
          return (
            <div key={element.id + element.name}>
              <p>{element.name}</p>
              <input id={element.id + element.name} onInput={handleChange} value={element.value} />
            </div>
          )
        })}
        <text className={styles.params}>{JSON.stringify(this.state.model)}</text>
      </div>
    )
  }
}


function App() {
  // Пример структуры:
  const params: Param[] = [
    {
      "id": 1,
      "name": "Назначение",
      "type": "string"
    },
    {
      "id": 2,
      "name": "Длина",
      "type": "string"
    },
    {
      "id": 3,
      "name": "Цена",
      "type": "тгьиук"
    }
  ];
  const model: Model = {
    "paramValues": [
      {
        "paramId": 1,
        "value": "повседневное"
      },
      {
        "paramId": 2,
        "value": "макси"
      },
      {
        "paramId": 7,
        "value": "otherVal"
      }
    ],
    "colors": []
  }
  return (
    <ParamEditor params={params} model={model} />
  );
}

export default App;
