const launcherRepository = 'DnCold/Coldem-launcher';
const deliveryRepository = 'DnCold/Coldem-delivery';

const launcherBaseUrl = `https://github.com/${launcherRepository}`;
const deliveryBaseUrl = `https://github.com/${deliveryRepository}`;

type GitHubAsset = {
	name: string;
	browser_download_url: string;
	size: number;
	digest?: string | null;
};

type GitHubRelease = {
	tag_name: string;
	name?: string | null;
	html_url: string;
	assets: GitHubAsset[];
};

export type ColdemReleaseData = {
	launcher: {
		version: string;
		releaseUrl: string;
		installerUrl: string;
		installerSize: string;
		installerSha: string;
	};
	game: {
		version: string;
		releaseUrl: string;
	};
};

const fallback: ColdemReleaseData = {
	launcher: {
		version: '0.4.1',
		releaseUrl: `${launcherBaseUrl}/releases/latest`,
		installerUrl: `${launcherBaseUrl}/releases/download/v0.4.1/Coldem_0.4.1_x64-setup.exe`,
		installerSize: '26.9 MB',
		installerSha: '856c2658a2c52da0...c75ea2628',
	},
	game: {
		version: '0.1.0',
		releaseUrl: `${deliveryBaseUrl}/releases/latest`,
	},
};

async function fetchRelease(repository: string): Promise<GitHubRelease | null> {
	try {
		const response = await fetch(`https://api.github.com/repos/${repository}/releases/latest`, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'dancold-website-build',
			},
		});

		if (!response.ok) return null;
		return (await response.json()) as GitHubRelease;
	} catch {
		return null;
	}
}

function releaseVersion(release: GitHubRelease | null, fallbackVersion: string): string {
	return release?.tag_name.match(/(\d+\.\d+\.\d+)/)?.[1] ?? fallbackVersion;
}

function formatMegabytes(bytes: number | undefined, fallbackValue: string): string {
	if (!bytes || !Number.isFinite(bytes)) return fallbackValue;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function shortDigest(digest: string | null | undefined, fallbackValue: string): string {
	const cleanDigest = digest?.replace(/^sha256:/, '');
	if (!cleanDigest) return fallbackValue;
	return `${cleanDigest.slice(0, 16)}...${cleanDigest.slice(-8)}`;
}

export async function getColdemReleaseData(): Promise<ColdemReleaseData> {
	const [launcherRelease, deliveryRelease] = await Promise.all([
		fetchRelease(launcherRepository),
		fetchRelease(deliveryRepository),
	]);

	const launcherVersion = releaseVersion(launcherRelease, fallback.launcher.version);
	const installer = launcherRelease?.assets.find(
		(asset) => /^Coldem_.*_x64-setup\.exe$/i.test(asset.name),
	);
	const gameVersion = releaseVersion(deliveryRelease, fallback.game.version);

	return {
		launcher: {
			version: launcherVersion,
			releaseUrl: launcherRelease?.html_url ?? fallback.launcher.releaseUrl,
			installerUrl:
				installer?.browser_download_url ??
				`${launcherBaseUrl}/releases/download/v${launcherVersion}/Coldem_${launcherVersion}_x64-setup.exe`,
			installerSize: formatMegabytes(installer?.size, fallback.launcher.installerSize),
			installerSha: shortDigest(installer?.digest, fallback.launcher.installerSha),
		},
		game: {
			version: gameVersion,
			releaseUrl: deliveryRelease?.html_url ?? fallback.game.releaseUrl,
		},
	};
}
