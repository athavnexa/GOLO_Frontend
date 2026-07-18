param(
    [string]$Path = "C:\Users\Atharv Apugade\GOLO\GOLO_Frontend_N\GOLO_Frontend\app"
)

$files = Get-ChildItem -Path $Path -Recurse -Filter "page.js"
$fixed = @()
$skipped = @()

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    # Skip if already has Suspense wrapper
    if ($content -match "Suspense") {
        $skipped += $file.FullName
        continue
    }
    
    # Skip if no useSearchParams
    if ($content -notmatch "useSearchParams") {
        continue
    }
    
    # Add Suspense to react import
    if ($content -match 'import \{ (.*?) \} from "react"') {
        $imports = $Matches[1]
        if ($imports -notmatch "Suspense") {
            $newImports = $imports + ", Suspense"
            $content = $content -replace [regex]::Escape("import { $imports } from `"react`""), "import { $newImports } from `"react`""
        }
    } else {
        $skipped += "$($file.FullName) (no react import)"
        continue
    }
    
    # Find the main exported function and rename it
    if ($content -match 'export default function (\w+)\(\)') {
        $funcName = $Matches[1]
        $contentName = $funcName + "Content"
        
        # Rename the function
        $content = $content -replace "export default function $funcName\(", "function $contentName("
        
        # Add wrapper at end
        $wrapper = @"

export default function $funcName() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F3F3]" />}>
      <$contentName />
    </Suspense>
  );
}
"@
        $content = $content.TrimEnd() + "`n" + $wrapper
        
        # Write back
        [System.IO.File]::WriteAllText($file.FullName, $content)
        $fixed += $file.FullName
    } else {
        $skipped += "$($file.FullName) (no default export)"
    }
}

Write-Host "`n=== FIXED ($($fixed.Count) files) ==="
$fixed | ForEach-Object { Write-Host "  $_" }

Write-Host "`n=== SKIPPED ($($skipped.Count) files) ==="
$skipped | ForEach-Object { Write-Host "  $_" }
