import sys
import os
import json
import re
import pandas as pd
import PyPDF2
from sentence_transformers import SentenceTransformer, util

# Command line arguments
answer_key_path = sys.argv[1]
students_folder_path = sys.argv[2]

# Initialize model
model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_answers_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "
    answers = re.split(r'\d+\.\s*', text)
    answers = [ans.strip() for ans in answers if ans.strip()]
    return answers

def calculate_score(student_answer, expected_answer):
    if not student_answer or not expected_answer:
        return 0
    student_embedding = model.encode(student_answer, convert_to_tensor=True)
    expected_embedding = model.encode(expected_answer, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(student_embedding, expected_embedding).item()
    return round(similarity * 100, 2)

# Extract expected answers from teacher PDF
expected_answers = extract_answers_from_pdf(answer_key_path)

# Loop through student PDFs
scores = {}

for filename in os.listdir(students_folder_path):
    if filename.endswith('.pdf') and filename != os.path.basename(answer_key_path):
        student_id = filename.replace('.pdf', '')
        student_pdf_path = os.path.join(students_folder_path, filename)

        student_answers = extract_answers_from_pdf(student_pdf_path)

        if len(student_answers) != len(expected_answers):
            scores[student_id] = {'error': 'Mismatch in number of answers'}
            continue

        individual_scores = [
            calculate_score(stu_ans, exp_ans)
            for stu_ans, exp_ans in zip(student_answers, expected_answers)
        ]
        avg_score = round(sum(individual_scores) / len(individual_scores), 2)

        scores[student_id] = {
            'average_score': avg_score,
            'individual_scores': individual_scores
        }

# Output scores as JSON to stdout
print(json.dumps(scores))
