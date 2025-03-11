#!/bin/bash

# Create models directory if it doesn't exist
mkdir -p public/models

# Function to download models
download_model() {
  local url="$1"
  local output="$2"
  echo "Downloading $output..."
  curl -L "$url" -o "$output" || echo "Failed to download $output"
}

# TEMPORARY: We'll use models from more reliable sources
# In a real implementation, you'd want custom models designed for your game
# These are just for demonstration purposes

# Player models
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/adventurer/model.gltf" "public/models/player.glb"
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/astronaut/model.gltf" "public/models/player_advanced.glb"
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/robot/model.gltf" "public/models/player_champion.glb"

# Bug models - we'll use placeholder models for each biome type
# Fire bugs (red insects)
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/scarab-beetle/model.gltf" "public/models/bug_fire.glb"
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/crab/model.gltf" "public/models/bug_fire_aggressive.glb"

# Water bugs (blue insects)
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/dragonfly/model.gltf" "public/models/bug_water.glb"
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shrimp/model.gltf" "public/models/bug_water_aggressive.glb"

# Grass bugs (green insects)
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/butterfly/model.gltf" "public/models/bug_grass.glb"
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/turtle/model.gltf" "public/models/bug_grass_aggressive.glb"

# Corruption bugs (purple insects)
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/spider/model.gltf" "public/models/bug_corruption.glb"
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bat-monster/model.gltf" "public/models/bug_corruption_aggressive.glb"

# Rock bugs (gray insects)
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/armadillo/model.gltf" "public/models/bug_rock.glb"
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/armored-car/model.gltf" "public/models/bug_rock_aggressive.glb"

# Snow bugs (white insects)
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf" "public/models/bug_snow.glb"
download_model "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/penguin/model.gltf" "public/models/bug_snow_aggressive.glb"

echo "Model download complete!" 