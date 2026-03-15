Investigating the Maternity Triage Application by Measuring Internal Product Attributes (Software Complexity)       
Introduction
    Software complexity refers to how difficult a program is to understand, maintain, test, and modify. Unlike Simple softwares, Complex Softwares are difficult to understand and break with ease.
 When a software becomes too complex, the following happens:
•	developers struggle to maintain it
•	errors increase
•	the system becomes unreliable
Therefore, software engineers measure complexity using software metrics.
In this investigation, Let’s analyse the Maternity Triage Application using internal product attribute metrics (Software Complexity) such as:
1.	Size Metrics (Lines of Code)
2.	Control Flow Complexity (Cyclomatic Complexity)
3.	Module/Structural Complexity
These metrics help determine how complicated the system is internally.
The analysis focuses mainly on modules like:
•	validateForm()
•	getPriority()
•	renderQueue()
•	updateQueueStats()
These modules control the logic of the triage system.

Metric 1: Size Metric (Lines of Code)
This metric measure how big a program is by counting the number of lines in the code.
Ideally, this means that “The more the Lines Code, the more Complicated the software is and the less the Lines Code, the simpler the software”
Application to the Maternity Triage System
The main logic of the system exists in JavaScript modules.
Example: Priority Logic
function getPriority(data) {

 if(data.systolic >= 160 || data.diastolic >= 110){
     return RED;
 }

 if(data.symptoms.includes("heavy-bleeding")){
     return RED;
 }

 if(data.ga < 37 && data.symptoms.includes("contractions")){
     return ORANGE;
 }

 return GREEN;

}

Size Evaluation
The triage application contains modules like:
Module	Approximate Code Size	Meaning
validateForm()	medium	Handles input checking
getPriority()	medium-large	Contains decision rules
renderQueue()	medium	Displays queue
updateQueueStats()	small	Counts patients
Interpretation
The system has moderate size complexity. This sis because of the following reasons below;
•	logic is divided into separate modules
•	each module performs one main task
This as a whole makes the system easier to maintain, debug, and extend


 Metric 2: Control Flow Complexity (Cyclomatic Complexity)
Cyclomatic complexity measures how many decision paths exist in the program. Every time the program makes a decision while using statements like:
if
else
switch
while
for
, the complexity increases. Relating it with the Triage Application, we used the getPriority() function decides the urgency of a patient.
Example:
if high blood pressure → RED
if heavy bleeding → RED
if preterm contractions → ORANGE
else → GREEN
In that scenario, each rule represents a decision path.
Simplified Decision Flow
Patient enters data
↓
Check Blood Pressure
↓
Check Symptoms
↓
Check Gestational Age
↓
Assign Priority
Estimated Cyclomatic Complexity
Each decision increases complexity.
Example:
Condition	Complexity
BP check	+1
bleeding check	+1
contraction check	+1
final decision	+1
Estimated complexity ≈ 4 – 6

Interpretation
This complexity level is good.
Industry recommendations say:
Complexity Value	Meaning
1–10	simple
10–20	moderate
>20	very complex
Our triage system remains within the safe range which means that;
•	testing is easier
•	debugging is easier
•	the system is reliable   


 Metric 3: Structural Complexity (Module Interaction)
 Structural complexity measures how different parts of the system depend on each other.
If many modules depend heavily on each other, the system becomes fragile, changing one part may break everything
Example:
Imagine in a hospital where maternity, pharmacy and lab depend all on one system that fails, that means everything stops working.
Good software design tries to reduce unnecessary dependencies.
Structure of the Triage System
The maternity triage application is designed using modular structure.
Main modules:
User Input Module
        ↓
Validation Module
        ↓
Priority Decision Module
        ↓
Queue Management Module
        ↓
Display Module 

Module Responsibilities
Module	Purpose
Input Module	collects patient information
validateForm()	checks if data is correct
getPriority()	determines urgency
queue system	stores patient records
renderQueue()	displays queue
updateQueueStats()	counts cases

Structural Observation
Each module has one responsibility. This is a good design because errors are easier to locate, code is easier to modify and complexity stays controlled


Data Complexity
Another internal attribute is data complexity which just refers to the amount and types of data the system processes.
The triage system handles different data types:
Data	Type
Gestational age	ratio
Blood pressure	ratio
Fetal heart rate	ratio
Symptoms	nominal
Priority level	ordinal
These variables interact to determine patient urgency.
Example:
Symptoms + BP + GA → Priority Level
This relationship increases complexity slightly, but it is necessary for accurate medical decisions.

Example Analysis Using the Code
Let us analyse a simplified rule.
Example:
if (systolic >=160 || diastolic >=110)
This literally means that if the mother's blood pressure is extremely high, the system immediately marks her case as critical (RED). This rule reduces decision time and improves patient safety.
However, each additional rule increases the program's internal complexity.
The challenge is to balance complexity with accuracy.

Complexity Evaluation of the Triage System
After applying the metrics, we can evaluate the overall complexity.
Metric	Result	Interpretation
Lines of Code	moderate	manageable size
Cyclomatic Complexity	low–moderate	easy to test
Structural Complexity	low	modular design
Data Complexity	moderate	due to medical variables

Benefits of Measuring Complexity
Measuring complexity helps improve the maternity triage system through the following ways as shown below
Easier maintenance as developers can update medical rules without breaking the system.
Better reliability as lower complexity reduces software bugs.
Improved safety since critical patients are prioritized quickly.
Easier testing due to low cyclomatic complexity thus fewer test cases are required.


Possible Improvements
To further reduce complexity, our system could introduce very many things like the
Rule Engine whereby instead of hard-coding rules like
if symptom A and BP >160, the rules could be stored in a configurable rule system so that updates are made easier when medical protocols change.
Logging System by the system recording information like:
•	number of RED cases
•	average waiting time
•	symptom frequency
This would consequently support the future empirical software analysis.
In Conclusion,
The investigation shows that the Maternity Triage Application maintains a balanced level of internal software complexity by using software complexity metrics like Size metrics, Cyclomatic complexity, Structural complexity, and Data complexity reflects the necessary medical information used to assess patient risk.
Overall, the system demonstrates good software engineering practices, making it reliable for use in maternity clinics where quick and accurate triage decisions are critical.


