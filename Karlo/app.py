from flask import Flask, request, jsonify
import requests
import json
import urllib
from PIL import Image
import os
from datetime import datetime
from translate import Translator
from config import *

app = Flask(__name__)


def t2i(prompt, negative_prompt, prior_num_inference_steps, guidance_scale, samples):
    r = requests.post(
        'https://api.kakaobrain.com/v2/inference/karlo/t2i',
        json={
            'prompt': prompt,
            'negative_prompt': negative_prompt,
            'prior_num_inference_steps': prior_num_inference_steps,
            'guidance_scale': guidance_scale,
            'upscale': True,
            'scheduler': 'decoder_ddim_v_prediction',
            'samples': samples
        },
        headers={
            'Authorization': f'KakaoAK {REST_API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    # 응답 JSON 형식으로 변환
    response = json.loads(r.content)
    return response


# 예시: 여러장의 이미지를 각각 저장
@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        translator = Translator(from_lang='ko', to_lang='en')
        data = request.get_json()
        prompt = data.get('prompt')
        negative_prompt = data.get('negative_prompt')
        prior_num_inference_steps = data.get('prior_num_inference_steps')
        guidance_scale = data.get('guidance_scale')
        samples = data.get('samples')

        translation_prompt = translator.translate(prompt)
        translation_negative_prompt = translator.translate(negative_prompt)

        api_response = t2i(
            translation_prompt, translation_negative_prompt, prior_num_inference_steps, guidance_scale, samples)

        save_folder = 'public/generated'
        if not os.path.exists(save_folder):
            os.makedirs(save_folder)

        generated_images = []  # 생성된 이미지들의 정보를 저장할 리스트

        for image_info in api_response.get("images"):
            image_url = image_info.get("image")
            image_seed = image_info.get("seed")

            generated_image = Image.open(urllib.request.urlopen(image_url))

            timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")
            image_filename = f'generated_img2text_{timestamp_str}_seed{image_seed}.png'
            image_path = os.path.join(save_folder, image_filename)
            generated_image.save(image_path)

            image_path = image_path.replace("\\", "/")
            generated_images.append({
                "image_url": image_url,
                "image_path": image_path
            })

        return jsonify(
            message='Images generated and saved successfully',
            generated_images=generated_images
        )

    except Exception as e:
        print('Error occurred while generating the images:', e)
        return jsonify(error='Error occurred while generating the images.'), 500


def variations(image, prompt, negative_prompt, samples):
    r = requests.post(
        'https://api.kakaobrain.com/v2/inference/karlo/variations',
        json={
            'image': image,
            'prompt': prompt,
            'negative_prompt': negative_prompt,
            'upscale': True,
            'scheduler': 'decoder_ddim_v_prediction',
            'samples': samples

        },
        headers={
            'Authorization': f'KakaoAK {REST_API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    # 응답 JSON 형식으로 변환
    response = json.loads(r.content)
    return response


@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        data = request.get_json()
        img_base64 = data['i2i_image']
        i2i_prompt = data['i2i_prompt']
        i2i_ne_prompt = data['i2i_ne_prompt']
        samples = data['samples']

        translator = Translator(from_lang='ko', to_lang='en')
        translator_i2i_prompt = translator.translate(i2i_prompt)
        translator_i2i_ne_prompt = translator.translate(i2i_ne_prompt)

        response = variations(
            img_base64, translator_i2i_prompt, translator_i2i_ne_prompt, samples)

        # 이미지를 로컬 폴더에 저장
        save_path = "public/generated"
        if not os.path.exists(save_path):
            os.makedirs(save_path)

        process_images = []
        for image_info in response.get("images"):
            image_url = image_info.get("image")
            image_seed = image_info.get("seed")

            process_image = Image.open(urllib.request.urlopen(image_url))

            timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")
            image_filename = f'generated_img2img_{timestamp_str}_seed{image_seed}.png'
            image_path = os.path.join(save_path, image_filename)
            process_image.save(image_path)

            image_path = image_path.replace("\\", "/")
            process_images.append({
                "image_url": image_url,
                "image_path": image_path
            })
        return jsonify(
            message='Images generated and saved successfully',
            process_images=process_images
        )

    except Exception as e:
        print('Error occurred while generating the images:', e)
        return jsonify(error='Error occurred while generating the images.'), 500


if __name__ == '__main__':
    app.run(port=5000)
