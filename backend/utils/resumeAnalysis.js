const crypto = require('crypto');
const ResumeAnalysisCache = require('../models/ResumeAnalysisCache');
const { parseResumeWithGemini } = require('./gemini');

const hashBuffer = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

const getCachedOrParseResume = async (fileBuffer, mimeType) => {
  const fileHash = hashBuffer(fileBuffer);

  const cached = await ResumeAnalysisCache.findOne({ fileHash });
  if (cached?.result) {
    console.log(`[AI Cache] Hit for hash ${fileHash.slice(0, 12)}...`);
    return cached.result;
  }

  const result = await parseResumeWithGemini(fileBuffer, mimeType);
  if (result) {
    await ResumeAnalysisCache.findOneAndUpdate(
      { fileHash },
      { fileHash, result },
      { upsert: true, new: true }
    );
    console.log(`[AI Cache] Stored result for hash ${fileHash.slice(0, 12)}...`);
  }

  return result;
};

module.exports = { hashBuffer, getCachedOrParseResume };
