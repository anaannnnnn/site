#!/bin/sh

input="$1"
filename=$(basename "$input")
name="${filename%.*}"

ffmpeg -i "$input" -vf "scale=1920:702:force_original_aspect_ratio=decrease,pad=1920:702:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 256k "/var/mobile/Documents/${name}_g06.mp4"