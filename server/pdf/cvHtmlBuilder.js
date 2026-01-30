const fs = require('fs');
const path = require('path');

function buildCvHtml(cv) {
  const template = fs.readFileSync(
    path.join(__dirname, 'templates', 'modern.html'),
    'utf8'
  );

  const style = fs.readFileSync(
    path.join(__dirname, 'styles', 'modern.css'),
    'utf8'
  );

  return template
    .replace('{{STYLE}}', style)
    .replace('{{FULLNAME}}', `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`)
    .replace('{{PROFESSION}}', cv.personalInfo.profession)
    .replace('{{EMAIL}}', cv.personalInfo.email)
    .replace('{{PHONE}}', cv.personalInfo.phone)
    .replace('{{ADDRESS}}', cv.personalInfo.address)
    .replace('{{SUMMARY}}', cv.summary)
    .replace(
      '{{SKILLS}}',
      cv.skills.map(skill => `<li>${skill}</li>`).join('')
    )
    .replace(
      '{{EXPERIENCES}}',
      cv.experiences.map(exp => `
        <div class="item">
          <strong>${exp.position}</strong> – ${exp.company}<br/>
          <small>${exp.startDate} → ${exp.endDate}</small>
          <p>${exp.description}</p>
        </div>
      `).join('')
    )
    .replace(
      '{{EDUCATIONS}}',
      cv.educations.map(edu => `
        <div class="item">
          <strong>${edu.degree}</strong> – ${edu.institution}<br/>
          <small>${edu.startDate} → ${edu.endDate}</small>
        </div>
      `).join('')
    )
    .replace(
      '{{PHOTO}}',
      cv.personalInfo.photo
        ? `<img class="photo" src="http://localhost:5001${cv.personalInfo.photo}" />`
        : ''
    );

}

module.exports = { buildCvHtml };
