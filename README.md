## CodeWithJess.ai is an AI-powerd personalized Khan Academy that revolutionizes CS learning. Jess crafts tailored learning paths, adapts to your progress, and provides interactive guidance every step of the way.
## Inspiration
The idea of CodeWithJess stems from a deeply personal experience that resonates with many. It all began when we witnessed a close friend struggle with their coding journey, constantly feeling overwhelmed and left behind in their classes. Their frustration ignited a spark within us—a realization that the traditional methods of teaching programming were failing countless aspiring coders. **With Jess, everything changes.** Jess builds a **scientifically structured lesson plan** just for you. You’re no longer bound to a rigid, fixed syllabus but one that is adapted to your personal skill.
Whether you’ve never written a line of code or you’re looking to expand your skills, Jess creates a journey that’s intuitive. Inspired by the interactive and accessible approach of platforms like Khan Academy; we envisioned a solution that could promote coding education for everyone. Our mission became to create a learning experience that can adapt to each individual's pace and style, making the daunting world of programming more approachable and engaging. With CodeWithJess, we're not just teaching code; we're nurturing curiosity, building confidence, and opening doors to the endless possibilities that coding skills can unlock.

## What it does
CodeWithJess is an innovative, AI-powered coding education platform designed to revolutionize how people learn programming. At its core is Jess, an interactive AI mentor that provides a personalized learning experience **tailored to each user's needs and goals.** Upon starting, users share their learning objectives and background, allowing Jess to craft a customized learning course from scratch. This adaptive AI continuously adjusts the curriculum based on the user's progress, offering interactive coding practice that evolves with the learner's skills.
Jess goes beyond simple instruction by answering specific coding questions, explaining related topics, and providing context to deepen understanding. Jess constantly **reassesses your current abilities** and **redesigns your lesson plan** on the fly. It’s dynamic. It’s flexible. It’s everything a traditional curriculum **isn’t**. Jess is **revolutionizing** the way coding is taught—**saving time, boosting learning, and making progress feel effortless.** Whether you're a beginner or looking to expand your coding repertoire; CodeWithJess is more than just a learning platform; it's a companion on your coding journey, ready to support, challenge, and inspire you every step of the way.

## Challenges we ran into
In developing CodeWithJess for this hackathon, our team encountered several significant challenges that tested our problem-solving skills and pushed us to innovate. However, through persistence and creativity, we overcame these obstacles.

To address the execution backend issues, particularly maintaining Python state persistence, we implemented a Python pipeline with environment serialization. This innovative approach allowed us to keep the environment in a pseudo-live state, enabling remote access and manipulation.

Docker compatibility posed another major hurdle. Initially, we encountered inconsistencies across team members’ environments, stemming from differences in operating systems and system configurations. These discrepancies caused our containerized Python execution environments to behave unpredictablely. The problem was resolved through cross-platform base images and intensive debugging sessions. were resolved through intensive debugging sessions, and the Docker environments eventually functioned consistently across all team members' machines.

For UI/UX design challenges, we conducted extensive research into potential code implementations and design patterns. Through a process of trial and error, coupled with rigorous testing and reformatting, we gradually refined our interface to achieve both functionality and aesthetic appeal. 

To tackle the architectural design of lesson plans, we created a comprehensive roadmap. This involved breaking down each component of the system, clearly delineating work assignments, and establishing a structured approach to subtopics and subplans. Overall improving our interactions as a team. 

Combined thorough research with practical experimentation, we leveraged tools like the Anthropic Workbench, meticulously tested ideas, and walked through implementations to ensure the AI behaved as intended.

These solutions not only resolved our immediate challenges but also enhanced our project's overall quality and our team's technical capabilities.

## Accomplishments that we're proud of
We’re proud to have harnessed the power of two state-of-the art language models (GPT o1 and Anthropic Claude 3.5) to generate lesson plans that are **tailored to each user’s unique skill level and goals**. This adaptive approach creates a personalized learning experience that evolves based on the user’s progress, offering guidance that is relevant, challenging, and rewarding.

From a design perspective, we’ve built a scalable backend with a focus on **modularity**. A standout example is the **AssistantChat component**, which serves as the backbone of our platform. It tracks conversations, communicates with the Claude language model, and invokes external tools. By modularizing this component, we ensure its seamless integration across various pages, such as onboarding and the editor, while maintaining flexibility for future development. This architecture allows us to easily adapt the platform to different coding languages and technical topics.

Finally, we paid special attention to the **onboarding process**, making it feel more like a conversation than a setup. Instead of filling out forms, users are greeted by **Jess**, our AI assistant, who guides them smoothly and intuitively through our sleek design.

Our platform boasts a **beautiful, intuitive UI/UX design** that integrates seamlessly with our AI-driven features, creating a clean and enjoyable learning experience. Additionally, the **editor** communicates with our **execution backend**, functioning as a live REPL. It runs the user’s code and returns real-time feedback, ensuring that learning to code is interactive and engaging without directly involving the language model in code execution.

## What we learned
- How to implement and create AI prompt engineering
- How to create effective data structures in TypeScript
- How to collaborate, brainstorm, and design decoupled software architecture. Not only does this optimize team task distribution, progress, and time management to successfully get most of the work done, but also improve code maintainability and scalability.
- How to code with Jess (just kidding)

## What's next for CodeWithJess
- As AI technology progresses, the platform can enhance its personalization capabilities, offering increasingly sophisticated and nuanced learning experiences.
- Integration of emerging technologies like VR and AR could create more immersive coding environments, while expansion into new programming languages and frameworks will keep the platform aligned with industry trends.
- Future developments may include collaborative community features: quizzes, forums, or peer interaction. Increasing a strong community bond and learning environment.
- Helps support concurrency to handle large users’ parallel requests.

## Required NPM Modules

### `npm i @anthropic-ai/sdk monaco-editor marked axios`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

