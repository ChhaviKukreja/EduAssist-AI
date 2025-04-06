import sys
import os
from pdf2image import convert_from_path


pdf_path = "D:/EDUASSIST-AI/backend/temp"
output_dir = "D:/output"

def extract_images(pdf_path, output_dir):
    print("PDF Path:", pdf_path)
    print("Output Directory:", output_dir)
    print("PDF Exists:", os.path.exists(pdf_path))

    try:
        os.makedirs(output_dir, exist_ok=True)
        poppler_path = r"D:\Release-24.08.0-0 (1)\poppler-24.08.0\Library\bin"

        images = convert_from_path(pdf_path, poppler_path=poppler_path)
        for i, image in enumerate(images):
            image_path = os.path.join(output_dir, f"extracted_{i+1}.png")
            image.save(image_path, "PNG")

        print("Images extracted successfully.")

    except Exception as e:
        import traceback
        print("Error extracting images:", str(e))
        traceback.print_exc()

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    output_dir = sys.argv[2]
    extract_images(pdf_path, output_dir)