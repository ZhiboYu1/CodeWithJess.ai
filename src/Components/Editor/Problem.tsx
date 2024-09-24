import "./Problem.css";
import {Exercise} from "../../types/Exercise";
import { marked } from 'marked';

interface ExerciseProps {
    exercise: Exercise
}

const Problem: React.FC<ExerciseProps> = ({ exercise }) => {
    let examples: JSX.Element[] = [];
    for (let i = 0; i < exercise.examples.length; i++) {
        const example = exercise.examples[i];
        examples.push(
            <div key={example.input} className={"problem-example-container"}>
                <img src={`/problem/example_text_${i + 1}.png`} alt={'Example'} width={128} height={20} className={'problem-container-heading'} />
                <div className={"problem-example-body"}>
                    <div className={"problem-example-group"}>
                        <span className={"problem-example-io-text problem-container-body"}>Input: </span>
                        <span className={"problem-example-io-value-code problem-container-body"}>{ example.input }</span>
                    </div>
                    <div className={"problem-example-group"}>
                        <span className={"problem-example-io-text problem-container-body"}>Output: </span>
                        <span className={"problem-example-io-value-code problem-container-body"}>{ example.output }</span>
                    </div>
                    <div className={"problem-example-group"}>
                        <span className={"problem-example-io-text problem-container-body"}>Explanation: </span>
                        <span className={"problem-example-io-value problem-container-body"}>{ example.explanation }</span>
                    </div>
                </div>
            </div>
        );
        if (i > 0) {
            examples.push(<div className={"problem-container-separator"} key={`separator-${i}`} />);
        }
    }

    return (
        <div className={"problem-main-container"}>
            <h1>{ exercise.title }</h1>
            <img src={'/problem/description_text.png'} alt={'Description'} width={153} height={20} className={'problem-container-heading'} />
            <div className={"problem-container-body"} dangerouslySetInnerHTML={{__html: marked.parse(exercise.description) as string}} />
            <div className={"problem-container-separator"} />
            { examples }
            <div className={"problem-container-separator"} />
            <img src={'/problem/constraints_text.png'} alt={'Constraints'} width={164} height={20} className={'problem-container-heading'} />
            <div className={"problem-container-body"} dangerouslySetInnerHTML={{__html: marked.parse(exercise.constraints) as string}} />
            {/*<div className={"problem-container-separator"} />*/}
        </div>
    );
}

export { Problem }