import fs from 'fs';
let code = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf-8');

const endOfFile = `        </div>
      </div>
    </div>
  );
}`;

const newEndOfFile = `        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}`;

if (code.endsWith(endOfFile)) {
    fs.writeFileSync('src/components/EditProfileModal.tsx', code.slice(0, -endOfFile.length) + newEndOfFile);
    console.log("Success");
} else {
    console.log("Does not end with expected string");
}
